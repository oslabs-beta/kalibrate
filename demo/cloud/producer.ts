import kafka from './testKafkaConfig';

// create a producer client
const producer = kafka.producer();

// connect to producer instance and publish messages to cluster
// consider: pass in topic and messages inputs to publishMessage?
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
