import {Kafka} from 'kafkajs';
import {clientCache} from '../server';
import {controller} from './../types';

const kafkaController: controller = {};

kafkaController.initiateKafka = async (req, res, next) => {
  let {clientId, brokers, ssl, sasl} = req.body;

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

  clientCache.set(id, clientId, kafkaClient); // cache in client cache

  return next();
};

kafkaController.cacheClients = (req, res, next) => {
  const {id} = res.locals.user;
  const clients = res.locals.clients;

  clientCache.setMany(id, clients); // cache several clients for a given user

  return next();
};

kafkaController.getCachedClient = (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId} = req.body;

  clientCache.getUnique(id, clientId);

  return next();
};

kafkaController.clearCachedClient = (req, res, next) => {
  const clientId = req.body;
  const {id} = res.locals.user;

  clientCache.delete(id, clientId); // delete from client cache

  return next();
};

export default kafkaController;

// {
//   cluster1: {...noSasl, sasl: false},
//   cluster1: {...Sasl, sasl: true},
// }
