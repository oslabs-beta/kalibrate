import {controller} from './../types';
import {PrismaClient} from '@prisma/client';
const AES = require('crypto-js/aes');

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

  // query database for all clusters matching specified userId
  // returns an array of objects
  // [{ id: 1, email: 'alice@prisma.io', name: 'Alice' }]
  const clusters = await prisma.cluster.findMany({
    where: {userId: id},
  });
  console.log('clusters', clusters);

  // decrypt password, initiate kafka server, send connection details to browser
  if (clusters.length) {
    const result = '';
    clusters.forEach(cluster => {
      const {clientId, saslMechanism, saslUsername, saslPassword} = cluster;

      // decrypt passwords
      const decryptedPassword = saslPassword ? AES.decrypt(saslPassword, ENCRYPT_KEY) : null;

      // initialize kafka instance
      // {clientId, brokers, ssl, sasl: {saslMechanism, saslUsername, saslPassword}}
    });
    // if there's no sasl, use seedBrokers to initiate Kafka
    res.locals.clusters = result;
  }

  // return next();
};

clusterController.storeClientConnection = async (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId, brokers, sasl} = res.locals.client;

  if (!id || !clientId || !brokers) {
    return next({
      log: `Error - clusterController.storeClient: Missing cluster data for database storage`,
      status: 404,
      message: 'Missing cluster data for database storage',
    });
  }

  // create Cluster record and connect it to an existing User record via id
  // nest the query to create a cluster connection and a seed broker record
  try {
    if (!sasl) {
      await prisma.$transaction(async (prisma) => {
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

      await prisma.$transaction(async (prisma) => {
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
