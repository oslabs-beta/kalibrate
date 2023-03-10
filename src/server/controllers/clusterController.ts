import {controller} from './../types';
import {PrismaClient} from '@prisma/client';
const AES = require('crypto-js/aes');
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
  console.log('clusters retrieved from database', clusters);

  // instantiate Kafka instance for all kafka clusters associated with a user
  if (clusters.length) {
    const userClusters: {[k: string]: any} = {};

    for (const cluster of clusters) {
      const {id, clientId, saslMechanism, saslUsername, saslPassword} = cluster;

      const brokers = await prisma.seedBroker.findMany({
        where: {clusterId: id},
        select: {broker: true},
      });

      const brokersMap = brokers.map(obj => obj.broker);

      const decryptedPassword = saslPassword ? AES.decrypt(saslPassword, ENCRYPT_KEY) : null;

      let kafka;
      if (brokers.length) {
        if (decryptedPassword && saslUsername && saslPassword) {
          kafka = new Kafka({
            clientId,
            brokers: brokersMap,
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: saslUsername,
              password: saslPassword,
            },
          });
        } else {
          kafka = new Kafka({
            clientId,
            brokers: brokersMap,
          });
        }

        userClusters['clientId'] = kafka;
      } else {
        return next({
          log: `ERROR in clusterController.getClientConnections: Cluster ${clientId} for the logged in user has no associated brokers`,
          status: 404,
          message: 'Missing brokers to connect to Kafka',
        });
      }
    }

    res.locals.client = userClusters;
  }

  return next();
};

clusterController.storeClientConnection = async (req, res, next) => {
  console.log(res.locals);
  const {id} = res.locals.user;
  const {clientId, brokers, sasl} = res.locals.client;

  if (!id || !clientId || !brokers) {
    return next({
      log: `Error - clusterController.storeClient: Missing cluster data for database storage`,
      status: 404,
      message: 'Missing cluster data for database storage',
    });
  }

  // create cluster record and connect it to an existing user record via id
  // nest the query to create a cluster connection and a seed broker record
  try {
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
            broker: brokers,
            cluster: {
              connect: {id: cluster.id},
            },
          },
        });
      });
    } else {
      const {mechanism, username, password} = sasl;
      const encryptedPassword = AES.encrypt(password, ENCRYPT_KEY);

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
            broker: brokers,
            cluster: {
              connect: {id: cluster.id},
            },
          },
        });
      });
    }
  } catch (err) {
    console.log('Error storing cluster connection details: ', err);
  }

  return next();
};

export default clusterController;
