import {Kafka} from 'kafkajs';
import {clientCache} from '../server';
import {controller} from './../types';

const kafkaController: controller = {};

kafkaController.initiateKafka = async (req, res, next) => {
  const {clientId, brokers, ssl, sasl} = req.body;

  let kafkaClient;

  // two supported connection types: with ssl & sasl, or without ssl & sasl
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

  // Verify cluster connection
  const testClient = kafkaClient.admin();

  try {
    await testClient.connect();
    await testClient.disconnect();

    res.locals.client = {
      clientId,
      brokers,
      ssl,
      sasl,
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

  clientCache.set(id, clientId, kafkaClient); // cache in clientCache

  return next();
};

kafkaController.storeClient = (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId, brokers, ssl, sasl} = res.locals.client;

  // store info in db (need user pw to encrypt?)

  return next();
};

export default kafkaController;
