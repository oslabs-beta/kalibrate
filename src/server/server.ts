import express, {Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import ClientCache from './ClientCache';
import ConsumerCache from './ConsumerCache';
import {errorObject} from './types';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

// Controller imports
import kafkaController from './controllers/kafkaController';
import consumerController from './controllers/consumerController';
import adminController from './controllers/adminController';
import authController from './controllers/authController';

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
const consumerCache = new ConsumerCache();

const app = express();

// Parse requests
app.use(express.json());
app.use(cookieParser());

// Routes
app.post('/api/signup', authController.createUser, authController.setSessionCookie, (req, res) => {
  const {user} = res.locals;
  return res.status(201).json(user);
});

app.post('/api/login', authController.verifyUser, authController.setSessionCookie, (req, res) => {
  const {user} = res.locals;
  return res.status(201).json(user);
});

app.get('/api/session', authController.verifySessionCookie, (req, res) => {
  return res.sendStatus(200);
});

app.get(
  '/api/connection',
  authController.verifySessionCookie,
  // todo: query database for all stored connections, decrypt passwords/intialize kafka instances/pass down chain
  kafkaController.cacheClients,
  (req, res) => {
    const clients = res.locals.clientCredentials;
    console.log('response', clients);
    return res.status(200).json(clients);
  }
);

// create and save a new sever connection for a given user
app.post(
  '/api/connection',
  // rate-limit connection attempts
  connectionLimiter,
  authController.verifySessionCookie,
  kafkaController.initiateKafka,
  kafkaController.cacheClient,
  // todo: controller(s) to encrypt and store in db
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
  // todo: controller(s) to delete record from db
  (req, res) => {
    return res.status(202).json(/* deleted cluster connection details to send*/);
  }
);

app.get(
  '/api/data/:clientId',
  authController.verifySessionCookie,
  kafkaController.getCachedClient,
  // get from db if not in cache
  adminController.getClusterData,
  adminController.getTopicData,
  adminController.getGroupData,
  (req, res) => {
    const {clusterData, topicData, groupList, groupData, groupOffsets} = res.locals;
    const data = {clusterData, topicData, groupList, groupData, groupOffsets};

    return res.status(200).json(data);
  }
);

app.get(
  '/api/messages/:clientId/:topic',
  authController.verifySessionCookie,
  consumerController.checkConsumerCache,
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
// Catch all handler
app.use('*', (req, res) => {
  return res.status(404).send('Not Found');
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
