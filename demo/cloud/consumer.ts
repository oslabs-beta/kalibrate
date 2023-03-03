import {Kafka} from 'kafkajs';
import KAFKA_TEST_CONFIG from './kafka-test-config';

// connect to a Kafka cluster instance
// See KafkaJS consumer demo

// Create a new instance of Kafka server
const kafka = new Kafka(KAFKA_TEST_CONFIG);

// create a consumer client with a unique groupId
const consumer = kafka.consumer({groupId: 'dev-group'});
const topic = 'topic-test';

// connect to consumer, subscribe to topics, and read one message at a time
const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({topic, fromBeginning: true});

  try {
    await consumer.run({
      eachMessage: async ({topic, partition, message}) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });
      },
    });
  } catch (err) {
    console.log(`[Consumer Error] ${err.message}:`, err);
  }
};
//run().catch(e => console.error(`Consumer error: ${e.message}`));
export default consumeMessages;
