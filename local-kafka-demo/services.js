import {Kafka, CompressionTypes} from 'kafkajs';
import {v4 as uuidv4} from 'uuid';
import ip from 'ip';

/*
TOPIC FLOW

user producer 
  -> requested order topic
    -> inventory consumer
      -> inventory producer
        -> inventory topic
          -> shipping consumer
    -> verify payment consumer 
      -> verify payment producer 
        -> payments topic
          -> finance consumer
          -> shipping consumer
    
  -> shipping producer (when payment verified + inventory confirmed)
    -> confirmed order topic
      -> user consumer
*/

console.log('Running services for web store local demo...');

// Connect to server
console.log(`IP: ${ip.address()}`);
console.log('Connecting to Kafka server...');
const kafka = new Kafka({
  clientId: 'webstore-local-demo',
  brokers: [`${ip.address()}:9092`], // your machine's ip
});

// Create service consumers
// const paymentConsumer = kafka.consumer();
// const financeConsumer = kafka.consumer();

// Create service producers
// const paymentProducer = kafka.producer();

// Shipping service cache
const shippingCache = {};

// Create shipping service
const shippingProducer = kafka.producer();
const shippingConsumer = kafka.consumer({groupId: 'shipping-group'});

// Subscribe to inventory topic and produce message to fulfilled whenever message is received
await shippingConsumer.connect();
await shippingConsumer.subscribe({topics: ['inventory']});
await shippingConsumer.run({
  eachMessage: async ({topic, partition, message}) => {
    console.log(`Shipping consumer received a message - ${message.key}: ${message.value}`);

    // create message based on cached values
    // if (message.key === 'inventory' && message.value.status === 'available') {
    //   if (shippingCache[message.value.orderId]) {
    //     shippingCache[message.value.orderId].payment ===
    //   }
    // }

    const status = message.value.status === 'available' ? 'confirmed' : 'rejected';

    const newMessage = {
      key: uuidv4(),
      value: JSON.stringify({
        status,
        itemId: message.value.itemId,
        orderId: message.value.orderId,
      }),
    };

    await shippingProducer.connect();
    await shippingProducer.send({
      topic: 'fulfilled',
      compression: CompressionTypes.GZIP,
      messages: [newMessage],
    });

    console.log(`Shipping producer sent a message: ${JSON.stringify(newMessage)}`);
    await shippingProducer.disconnect();
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

    const status = Math.random() < 0.2 ? 'unavailable' : 'available';

    const newMessage = {
      key: 'inventory',
      value: JSON.stringify({
        status,
        itemId: message.value.itemId,
        orderId: message.key,
      }),
    };

    await inventoryProducer.connect();
    await inventoryProducer.send({
      topic: 'inventory',
      compression: CompressionTypes.GZIP,
      messages: [newMessage],
    });

    console.log(`Inventory producer sent a message: ${JSON.stringify(newMessage)}`);
    await inventoryProducer.disconnect();
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

// Send a user message at a random interval b/w 0-5 seconds
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
    compression: CompressionTypes.GZIP,
    messages: [newMessage],
  });

  console.log(`User producer sent a message: ${JSON.stringify(newMessage)}`);
  await userProducer.disconnect();

  setTimeout(produceUserMessage, Math.random() * 5000);
};

setTimeout(produceUserMessage, Math.random() * 5000);
