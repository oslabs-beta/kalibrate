const {Kafka} = require('kafkajs');
import KAFKA_TEST_CONFIG from '../../../kafka-test-config';

//GET request to /cluster-info should get back object shaped like this
// {
//   brokers: [
//     { nodeId: 0, host: 'localhost', port: 9092 }
//   ],
//   controller: 0,
//   clusterId: 'f8QmWTB8SQSLE6C99G4qzA'
// }
//need to double check clientID, brokers, and if need groupID
const kafka = new Kafka({
  KAFKA_TEST_CONFIG,
});

const consumer = kafka.consumer();
const topic = 'topic-test';

const run = async () => {
  //Consuming
  await consumer.connect();
  //subscribe to a topic an read messages from topic
  //fromBeginning??
  await consumer.subscribe({topic, fromBeginning: true});
  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};
