import {controller} from './../types';
import {PrismaClient} from '@prisma/client';
import CryptoJS from 'crypto-js';
import {Kafka} from 'kafkajs';

const prisma = new PrismaClient();
const ENCRYPT_KEY: string = process.env.ENCRYPT_KEY || 'key';

const clusterController: controller = {};

clusterController.getClientConnections = async (req, res, next) => {
  const {id} = res.locals.user;

  if (!id) {
    return next({
      log: 'ERROR - clusterController.getConnectionDetails: Failed to read id for logged in user',
      status: 404,
      message: 'Unable to get cluster connection details',
    });
  }

  // query db for all clusters matching specified userId and brokers matching clusterId
  const clusters = await prisma.cluster.findMany({
    where: {userId: id},
  });

  // to store client information and send back in response
  const clientCredentials = [];

  // to store kakfa instance
  const userClusters: {[k: string]: any} = {};

  // instantiate Kafka instance for all kafka clusters associated with a user
  if (clusters.length) {
    for (const cluster of clusters) {
      const {id, clientId, saslMechanism, saslUsername, saslPassword} = cluster;

      const brokers = await prisma.seedBroker.findMany({
        where: {clusterId: id},
        select: {broker: true},
      });

      const brokersMap = brokers.map(obj => obj.broker); // format brokers list

      const decryptedPassword = saslPassword
        ? CryptoJS.AES.decrypt(saslPassword, ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
        : null;

      let kafka;
      if (brokers.length) {
        if (decryptedPassword && saslUsername) {
          kafka = new Kafka({
            clientId,
            brokers: brokersMap,
            ssl: true,
            sasl: {
              mechanism: 'plain', // hardcoded for now, needs to be updated if we implement other mechanisms
              username: saslUsername,
              password: decryptedPassword,
            },
          });
        } else {
          kafka = new Kafka({
            clientId,
            brokers: brokersMap,
          });
        }

        userClusters[clientId] = kafka; // save instance

        // generate client credentials list entry
        if (saslMechanism && saslUsername && saslPassword) {
          clientCredentials.push({
            clientId: cluster.clientId,
            brokers: brokersMap,
            ssl: true,
            sasl: {
              mechanism: 'plain', // hardcoded for now, needs to be updated if we implement other mechanisms
              username: saslUsername, // don't include password since for response
            },
          });
        } else {
          clientCredentials.push({
            clientId: cluster.clientId,
            brokers: brokersMap,
          });
        }
      } else {
        return next({
          log: `ERROR in clusterController.getClientConnections: Cluster ${clientId} for the logged in user has no associated brokers`,
          status: 400,
          message: 'Missing brokers to connect to Kafka',
        });
      }
    }
  }

  res.locals.clientCredentials = clientCredentials;
  res.locals.clients = userClusters;

  return next();
};

clusterController.getClientConnection = async (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId} = req.params;

  // skip if cache hit from previous middleware
  if (res.locals.kafka) return next();

  if (!id) {
    return next({
      log: 'ERROR - clusterController.getConnectionDetail: Failed to read id for logged in user',
      status: 404,
      message: 'Unable to retrieve client information',
    });
  }

  try {
    // query db for requestedc client
    let clientQuery = await prisma.cluster.findMany({
      where: {userId: id, clientId},
    });

    if (!clientQuery.length) throw new Error('Query for requested client found no records');

    const client = clientQuery[0]; // index found record out of array

    // Find seed brokers/URI with found client
    const brokersQuery = await prisma.seedBroker.findMany({
      where: {clusterId: client.id},
      select: {broker: true},
    });

    if (!brokersQuery.length)
      throw new Error('Query for requested client URI/seed brokers found no records');

    const brokers = brokersQuery[0].broker; // index found record out of array and access prop

    // Create Kafka instance
    const {saslUsername, saslPassword} = client;

    const decryptedPassword = saslPassword
      ? CryptoJS.AES.decrypt(saslPassword, ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
      : null;

    let kafka;
    if (decryptedPassword && saslUsername) {
      kafka = new Kafka({
        clientId,
        brokers: [brokers],
        ssl: true,
        sasl: {
          mechanism: 'plain', // hardcoded for now, needs to be updated if we implement other mechanisms
          username: saslUsername,
          password: decryptedPassword,
        },
      });
    } else {
      kafka = new Kafka({
        clientId,
        brokers: [brokers],
      });
    }

    res.locals.client = {
      clientId,
      kafkaClient: kafka,
    };

    return next();
  } catch (err) {
    return next({
      log: `ERROR - clusterController.getClientConnection: ${err}`,
      status: 404,
      message: 'Unable to retrieve client information',
    });
  }
};

clusterController.storeClientConnection = async (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId, brokers, sasl} = res.locals.client;

  if (!id || !clientId || !brokers) {
    return next({
      log: `Error - clusterController.storeClient: Missing cluster data for database storage`,
      status: 404,
      message: {err: 'Missing required information to create client'},
    });
  }

  // create cluster record and connect it to an existing user record via id
  // nest the query to create a cluster connection and a seed broker record
  try {
    // clientId must be unique, so check if provide clientId already in use by user
    const clientIdMatch = await prisma.cluster.findMany({
      where: {userId: id, clientId},
    });

    if (clientIdMatch.length) throw new Error('Client ID already in use for given user');

    if (!sasl) {
      await prisma.$transaction(async prisma => {
        const cluster = await prisma.cluster.create({
          data: {
            clientId,
            user: {
              connect: {id},
            },
          },
        });

        await prisma.seedBroker.create({
          data: {
            broker: brokers[0], // logic would need to be updated if we want to support multiple brokers
            cluster: {
              connect: {id: cluster.id},
            },
          },
        });
      });
    } else {
      const {mechanism, username, password} = sasl;
      const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPT_KEY).toString();

      await prisma.$transaction(async prisma => {
        const cluster = await prisma.cluster.create({
          data: {
            clientId,
            saslMechanism: mechanism,
            saslUsername: username,
            saslPassword: encryptedPassword,
            user: {
              connect: {id},
            },
          },
        });
        await prisma.seedBroker.create({
          data: {
            broker: brokers[0], // logic would need to be updated if we want to support multiple brokers
            cluster: {
              connect: {id: cluster.id},
            },
          },
        });
      });
    }
  } catch (err) {
    return next({
      log: `ERROR - clusterController.storeClient: Failed to store new client: ${err}`,
      status: 400,
      message: {err: 'Failed to create new client'},
    });
  }

  return next();
};

clusterController.deleteClientConnection = async (req, res, next) => {
  const {clientId} = req.body;
  const {id} = res.locals.user;

  // find clusterId, then delete broker and client
  try {
    // will return array of obj, so afer query to access id index 0 and access id prop
    await prisma.$transaction(async prisma => {
      const clusterId = await prisma.cluster.findMany({
        where: {clientId, userId: id},
        select: {id: true},
      });

      if (!clusterId.length) throw new Error('Did not find requested cluster');

      await prisma.seedBroker.deleteMany({
        where: {clusterId: clusterId[0].id},
      });

      await prisma.cluster.deleteMany({
        where: {clientId, userId: id},
      });
    });

    return next();
  } catch (err) {
    return next({
      log: `ERROR - clusterController.deleteClientConnection: Failed to delete client: ${err}`,
      status: 400,
      message: {err: 'Failed to delete client'},
    });
  }
};

export default clusterController;
