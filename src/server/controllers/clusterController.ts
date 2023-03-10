import {controller} from './../types';
import {PrismaClient} from '@prisma/client';
const CryptoJS = require('crypto-js');
import {Kafka} from 'kafkajs';

const prisma = new PrismaClient();
const ENCRYPT_KEY: string = process.env.ENCRYPT_KEY || 'key';

const clusterController: controller = {};

clusterController.getClientConnections = async (req, res, next) => {
  const {id} = res.locals.user;

  console.log('getting user id to get connections', id);

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

  console.log('cluster query', clusters);

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
      console.log('decrypted:', decryptedPassword);
      let kafka;
      if (brokers.length) {
        if (saslPassword && saslUsername && saslPassword) {
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
          status: 404,
          message: 'Missing brokers to connect to Kafka',
        });
      }
    }
  }
  console.log('resulting creds', clientCredentials);
  console.log('resulting instances', userClusters);

  res.locals.clientCredentials = clientCredentials;
  res.locals.clients = userClusters;

  return next();
};

clusterController.storeClientConnection = async (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId, brokers, sasl} = res.locals.client;
  console.log('storing client', id, clientId, brokers, sasl);
  if (!id || !clientId || !brokers) {
    return next({
      log: `Error - clusterController.storeClient: Missing cluster data for database storage`,
      status: 404,
      message: {err: 'Missing cluster data for database storage'},
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
            broker: brokers[0], // need to update logic for multiple brokers
            cluster: {
              connect: {id: cluster.id},
            },
          },
        });
      });
    } else {
      const {mechanism, username, password} = sasl;
      const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPT_KEY).toString();
      console.log('encrypted:', encryptedPassword);
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
            broker: brokers[0], // need to update logic for multiple brokers
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
      status: 404,
      message: {err: 'Failed to created new client'},
    });
  }

  return next();
};

export default clusterController;
