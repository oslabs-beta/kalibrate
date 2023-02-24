import Kafka from 'kafkajs';

const kafkaController = {};

// use connection form data to connect to the KafkaJS server
// two connection types: 1. with ssl & sasl | 2. without ssl & sasl
kafkaController.initiateKafka = (req, res, next) => {
  const {brokers, mechanism, username, password, ssl, sasl} = req.body;
  if (!brokers || !clientId || !mechanism || !username || !password)
    return next({
      log: 'kafkaController.initiateKafka failed due to missing form data',
      status: 403,
      message: 'Missing form data to connect to Kafka server',
    });

  console.log('Initiating connection to Kafka');

  //let kafka;

  try {
    if (!ssl && !sasl) {
      // creating kafka instance on the exported controller object so it will be accessible elsewhere
      this.kafka = new Kafka({
        clientId,
        brokers,
      });
    } else {
      kafka = new Kafka({
        clientId,
        brokers,
        ssl: true,
        sasl: {
          mechanism,
          username,
          password,
        },
      });
    }
  } catch (err) {
    return next({
      log: 'kafkaController.initiateKafka failed to connect to Kafka',
      status: 403,
      message: 'Error in connecting to Kafka server',
    });
  }
};

export default kafkaController;