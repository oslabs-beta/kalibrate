import {Kafka} from 'kafkajs';
import {controller} from './../types';

const kafkaController: controller = {};

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

  //let kafka;

  try {
    if (!sasl) {
      // creating kafka instance on the exported controller object so it will be accessible elsewhere
      kafkaController.kafka = new Kafka({
        clientId,
        brokers,
      });
    } else {
      console.log('connecting with sasl...');
      kafkaController.kafka = new Kafka({
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
