import {Kafka} from 'kafkajs';
import {clientCache} from '../server';
import {controller} from './../types';

const kafkaController: controller = {};

// two supported connection types: 1. with ssl & sasl | 2. without ssl & sasl
kafkaController.initiateKafka = async (req, res, next) => {
  const {clientId, brokers, ssl, sasl} = req.body;

  let kafkaClient;

  if (!sasl) {
    kafkaClient = new Kafka({
      clientId,
      brokers,
    });
  } else {
    kafkaClient = new Kafka({
      clientId,
      brokers,
      ssl,
      sasl,
    });
  }

  const testClient = kafkaClient.admin();

  try {
    // Verify cluster connection
    await testClient.connect();
    await testClient.disconnect();

    res.locals.client = {
      clientId,
      kafkaClient,
    };

    return next();
  } catch (err) {
    return next({
      log: `ERROR - kafkaController.initiateKafka: failed to connect to Kafka: ${err}`,
      status: 403,
      message: 'Failed to connect to provided server, please verify crendentials are correct',
    });
  }
};

kafkaController.cacheClient = (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId, kafkaClient} = res.locals.client;

  clientCache.set(id, clientId, kafkaClient);
  console.log('kafka cache:', clientCache.cache); // remove

  return next();
};

kafkaController.storeClient = (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId, kafkaClient} = res.locals.client;

  clientCache.set(id, clientId, kafkaClient);
  console.log('kafka cache:', clientCache.cache); // remove

  return next();
};

export default kafkaController;
