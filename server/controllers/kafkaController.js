import {Kafka} from 'kafkajs';

const kafkaController = {};

// use connection form data to connect to the KafkaJS server
// two connection types: 1. with ssl & sasl | 2. without ssl & sasl
kafkaController.initiateKafka = (req, res, next) => {
  const {clientId, brokers, ssl, sasl} = req.body;

  if (!clientId || !brokers || !sasl.username || !sasl.password) {
    return next({
      log: 'kafkaController.initiateKafka failed due to missing form data',
      status: 403,
      message: 'Missing form data to connect to Kafka server',
    });
  }

  let kafka;

  try {
    if (!sasl) {
      kafka = new Kafka({
        clientId,
        brokers,
      });
    } else {
      console.log('connecting with sasl...');
      kafka = new Kafka({
        clientId,
        brokers,
        ssl,
        sasl,
      });
    }

    return next();
  } catch (err) {
    return next({
      log: `kafkaController.initiateKafka failed to connect to Kafka: ${err}`,
      status: 403,
      message: 'Error in connecting to Kafka server',
    });
  }
};

export default kafkaController;
