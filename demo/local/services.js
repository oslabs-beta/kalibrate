import {Kafka, CompressionTypes} from 'kafkajs';
import {v4 as uuidv4} from 'uuid';
import ip from 'ip';

console.log(`IP: ${ip.address()}`);
console.log('Running services for web store local demo...\n');

// Connect to server
console.log('Connecting to Kafka server...');
const kafka = new Kafka({
  clientId: 'webstore-local-demo',
  brokers: [`${ip.address()}:9092`], // your machine's ip
});

// Create finance service
const financeConsumer = kafka.consumer({groupId: 'finance-group'});

await financeConsumer.connect();
await financeConsumer.subscribe({topics: ['unfulfilled']});
await financeConsumer.run({
  eachMessage: async ({topic, partition, message}) => {
    console.log(`Finance consumer received a message - ${message.key}: ${message.value}`);
  },
});

// Create payments service
const paymentProducer = kafka.producer();
const paymentConsumer = kafka.consumer({groupId: 'payment-service'});

// Subscribe to unfulfilled topic and produce message to inventory whenever message is received
await paymentConsumer.connect();
await paymentConsumer.subscribe({topics: ['unfulfilled']});
await paymentConsumer.run({
  eachMessage: async ({topic, partition, message}) => {
    console.log(`Payment consumer received a message - ${message.key}: ${message.value}`);
    const parsedMessageValue = JSON.parse(message.value.toString());

    const status = Math.random() < 0.2 ? 'rejected' : 'verified';

    const newMessage = {
      key: 'payment',
      value: JSON.stringify({
        status,
        itemId: parsedMessageValue.itemId,
        orderId: message.key.toString(),
      }),
    };

    setTimeout(async () => {
      await paymentProducer.connect();
      await paymentProducer.send({
        topic: 'payments',
        messages: [newMessage],
      });

      console.log(`Payment producer sent a message - ${newMessage.key}: ${newMessage.value}`);
      await paymentProducer.disconnect();
    }, Math.random() * 3000);
  },
});

// Create shipping service
const shippingProducer = kafka.producer();
const shippingConsumer = kafka.consumer({groupId: 'shipping-group'});

// Shipping service cache
const shippingCache = {};

// Subscribe to inventory topic and produce message to fulfilled whenever message is received
await shippingConsumer.connect();
await shippingConsumer.subscribe({topics: ['inventory', 'payments']});
await shippingConsumer.run({
  eachMessage: async ({topic, partition, message}) => {
    console.log(`Shipping consumer received a message - ${message.key}: ${message.value}`);
    const parsedMessageValue = JSON.parse(message.value.toString());

    // create an entry for the cache if it doesn't exist
    if (!shippingCache[parsedMessageValue.orderId]) shippingCache[parsedMessageValue.orderId] = {};

    // update shipment status and/or cache based on cached values
    let status;
    if (message.key.toString() === 'inventory') {
      shippingCache[parsedMessageValue.orderId].inventory = parsedMessageValue.status;

      if (shippingCache[parsedMessageValue.orderId].payment) {
        status =
          shippingCache[parsedMessageValue.orderId].payment === 'verified' &&
          shippingCache[parsedMessageValue.orderId].inventory === 'available'
            ? 'shipped'
            : 'cancelled';
      }
    } else if (message.key.toString() === 'payment') {
      shippingCache[parsedMessageValue.orderId].payment = parsedMessageValue.status;

      if (shippingCache[parsedMessageValue.orderId].inventory) {
        status =
          shippingCache[parsedMessageValue.orderId].inventory === 'available' &&
          shippingCache[parsedMessageValue.orderId].payment === 'verified'
            ? 'shipped'
            : 'cancelled';
      }
    }

    // if there's a shipment status, send message
    if (status) {
      const newMessage = {
        key: uuidv4(),
        value: JSON.stringify({
          shippingStatus: status,
          paymentStatus: shippingCache[parsedMessageValue.orderId].payment,
          inventoryStatus: shippingCache[parsedMessageValue.orderId].inventory,
          itemId: parsedMessageValue.itemId,
          orderId: parsedMessageValue.orderId,
        }),
      };

      delete shippingCache[parsedMessageValue.orderId]; // remove order from cache since no longer needs to be tracked

      setTimeout(async () => {
        await shippingProducer.connect();
        await shippingProducer.send({
          topic: 'fulfilled',
          messages: [newMessage],
        });

        console.log(`Shipping producer sent a message - ${newMessage.key}: ${newMessage.value}`);
        await shippingProducer.disconnect();
      }, Math.random() * 3000);
    }
  },
});

// Create inventory service
const inventoryProducer = kafka.producer();
const inventoryConsumer = kafka.consumer({groupId: 'inventory-group'});

// Subscribe to unfulfilled topic and produce message to inventory whenever message is received
await inventoryConsumer.connect();
await inventoryConsumer.subscribe({topics: ['unfulfilled']});
await inventoryConsumer.run({
  eachMessage: async ({topic, partition, message}) => {
    console.log(`Inventory consumer received a message - ${message.key}: ${message.value}`);
    const parsedMessageValue = JSON.parse(message.value.toString());

    const status = Math.random() < 0.2 ? 'unavailable' : 'available';

    const newMessage = {
      key: 'inventory',
      value: JSON.stringify({
        status,
        itemId: parsedMessageValue.itemId,
        orderId: message.key.toString(),
      }),
    };

    setTimeout(async () => {
      await inventoryProducer.connect();
      await inventoryProducer.send({
        topic: 'inventory',
        messages: [newMessage],
      });

      console.log(`Inventory producer sent a message - ${newMessage.key}: ${newMessage.value}`);
      await inventoryProducer.disconnect();
    }, Math.random() * 3000);
  },
});

// Create user service
const userProducer = kafka.producer();
const userConsumer = kafka.consumer({groupId: 'user-group'});

// Subscribe to fulfilled topic
await userConsumer.connect();
await userConsumer.subscribe({topics: ['fulfilled']});
await userConsumer.run({
  eachMessage: async ({topic, partition, message}) => {
    console.log(`User consumer received message - ${message.key}: ${message.value}`);
  },
});

// Send a user order at a random interval between 0-5 seconds
const produceUserMessage = async () => {
  await userProducer.connect();

  const newMessage = {
    key: uuidv4(),
    value: JSON.stringify({
      status: 'submitted',
      paymentAccount: uuidv4(),
      itemId: Math.floor(Math.random() * 10000),
    }),
  };

  await userProducer.send({
    topic: 'unfulfilled',
    messages: [newMessage],
  });

  console.log(`User producer sent a message - ${newMessage.key}: ${newMessage.value}`);
  await userProducer.disconnect();

  setTimeout(produceUserMessage, Math.random() * 5000);
};

setTimeout(produceUserMessage, Math.random() * 5000);
