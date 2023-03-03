import {Kafka} from 'kafkajs';
import KAFKA_TEST_CONFIG from './kafka-test-config';

// Connect to a Kafka cluster instance
// See KafkaJS producer demo

const kafka = new Kafka(KAFKA_TEST_CONFIG);

// create a producer client
const producer = kafka.producer();

// connect to producer instance and publish messages to cluster
const publishMessages = async () => {
  await producer.connect();

  try {
    await producer.send({
      topic: 'topic1',
      messages: [
        {key: '1', value: 'hello', partition: 0},
        {key: '2', value: 'hi', partition: 1},
      ],
    });
    console.log('Published message');
  } catch (err) {
    console.log(`[Producer Error] ${err.message}:`, err);
  }
};

export default publishMessages;
