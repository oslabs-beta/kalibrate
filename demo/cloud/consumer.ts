import kafka from './testKafkaConfig';

// GET request to /cluster-info should get back object shaped like this
// {
//   brokers: [
//     { nodeId: 0, host: 'localhost', port: 9092 }
//   ],
//   controller: 0,
//   clusterId: 'f8QmWTB8SQSLE6C99G4qzA'
// }

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
