import express, {Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import ClientCache from './ClientCache';
import ConsumerCache from './ConsumerCache';
import {errorObject} from './types';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Controller imports
import kafkaController from './controllers/kafkaController';
import consumerController from './controllers/consumerController';
import adminController from './controllers/adminController';
import authController from './controllers/authController';
import clusterController from './controllers/clusterController';
import topicController from './controllers/topicController';

// Create rate limiter for connection requests: max 5 per IP address within one minute
const connectionLimiter = rateLimit({
  windowMs: 60000,
  max: 5,
  message: 'Exceeded the number of allowed connection attempts. Please try again in a few minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Create caches
const clientCache = new ClientCache();
clientCache.clear(1800000); // clear inactive clients from cache every 30 min

const consumerCache = new ConsumerCache();

// Instantiate server
const app = express();

// Serve client production bundle
app.use('/client', express.static(path.resolve(__dirname, '..', 'client')));

// Parse requests
app.use(express.json());
app.use(cookieParser());

// User account routes
app.post('/api/signup', authController.createUser, authController.setSessionCookie, (req, res) => {
  const {user} = res.locals;
  return res.status(201).json(user);
});

app.post('/api/login', authController.verifyUser, authController.setSessionCookie, (req, res) => {
  const {user} = res.locals;
  return res.status(201).json(user);
});

app.get(
  '/api/reset',
  authController.verifySessionCookie,
  authController.clearSessionCookie,
  (req, res) => {
    return res.sendStatus(200);
  }
);

app.get('/api/session', authController.verifySessionCookie, (req, res) => {
  return res.sendStatus(200);
});

app.patch(
  '/api/settings/account',
  authController.verifySessionCookie,
  authController.updateUser,
  (req, res) => {
    return res.sendStatus(200);
  }
);

// Kafka server instance routes
app.get(
  '/api/connection',
  authController.verifySessionCookie,
  clusterController.getClientConnections,
  kafkaController.cacheClients,
  (req, res) => {
    const clients = res.locals.clientCredentials;

    return res.status(200).json(clients);
  }
);

app.post(
  '/api/connection',
  connectionLimiter, // rate-limit connection attempts
  authController.verifySessionCookie,
  kafkaController.initiateKafka,
  kafkaController.cacheClient,
  clusterController.storeClientConnection,
  (req, res) => {
    let {clientId, brokers, ssl, sasl} = res.locals.client;

    if (sasl)
      sasl = {
        mechanism: sasl.mechanism,
        username: sasl.username,
      };

    return res.status(201).json({
      clientId,
      brokers,
      ssl,
      sasl,
    });
  }
);

app.delete(
  '/api/connection',
  authController.verifySessionCookie,
  kafkaController.clearCachedClient,
  clusterController.deleteClientConnection,
  (req, res) => {
    return res.sendStatus(204);
  }
);

// Kafka server data routes
app.get(
  '/api/data/:clientId',
  authController.verifySessionCookie,
  kafkaController.getCachedClient,
  clusterController.getClientConnection,
  kafkaController.cacheClient,
  kafkaController.getCachedClient,
  adminController.getClusterData,
  adminController.getTopicData,
  adminController.getGroupData,
  (req, res) => {
    const {clusterData, topicData, groupList, groupData, groupOffsets} = res.locals;
    const data = {clusterData, topicData, groupList, groupData, groupOffsets};

    return res.status(200).json(data);
  }
);

app.post(
  '/api/:clientId/topic',
  authController.verifySessionCookie,
  kafkaController.getCachedClient,
  clusterController.getClientConnection,
  kafkaController.cacheClient,
  kafkaController.getCachedClient,
  topicController.createTopic,
  adminController.getTopicData,
  (req, res) => {
    return res.status(200).json(res.locals.topicData);
  }
);

app.delete(
  '/api/:clientId/topic',
  authController.verifySessionCookie,
  kafkaController.getCachedClient,
  clusterController.getClientConnection,
  kafkaController.cacheClient,
  kafkaController.getCachedClient,
  topicController.deleteTopic,
  adminController.getTopicData,
  (req, res) => {
    return res.status(200).json(res.locals.topicData);
  }
);

app.get(
  '/api/messages/:clientId/:topic',
  authController.verifySessionCookie,
  consumerController.checkConsumerCache,
  kafkaController.getCachedClient,
  clusterController.getClientConnection,
  kafkaController.cacheClient,
  kafkaController.getCachedClient,
  consumerController.getMessages,
  (req, res) => {
    return res.status(200).json(res.locals.topicMessages);
  }
);

app.patch(
  '/api/settings/account',
  authController.verifySessionCookie,
  authController.updateUser,
  (req, res) => {
    return res.sendStatus(200);
  }
);

app.get(
  '/api/reset',
  authController.verifySessionCookie,
  authController.clearSessionCookie,
  (req, res) => {
    return res.sendStatus(200);
  }
);

app.post('/api/password/forgot', authController.sendResetPassword, (req, res) => {
  return res.sendStatus(200);
});

app.patch('/api/password/reset', authController.resetPassword, (req, res) => {
  return res.sendStatus(200);
});

app.post(
  'api/alert',
  authController.verifySessionCookie,
  adminController.sendAlertEmail,
  (req, res) => {
    return res.sendStatus(200);
  }
);

app.post('/api/settings/delete/cluster', authController.verifySessionCookie, (req, res) => {
  return res.sendStatus(200);
});
app.post('/api/settings/delete/account', authController.verifySessionCookie, (req, res) => {
  return res.sendStatus(200);
});
// Catch all handler
app.use('*', (req, res) => {
  return res.status(404).send('Not Found');
});
// Catch all to serve app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});

// Global error handler
app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  const defaultErr: errorObject = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: {err: 'An error occurred'},
  };
  const errorObj: errorObject = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: ${process.env.PORT}`);
});

export {app, clientCache, consumerCache};
