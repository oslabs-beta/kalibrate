import express, {Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import ClientCache from './ClientCache';
import {errorObject} from './types';
import dotenv from 'dotenv';
dotenv.config();

// Controller imports
import kafkaController from './controllers/kafkaController';
import topicController from './controllers/topicController';
import adminController from './controllers/adminController';
import authController from './controllers/authController';

const clientCache = new ClientCache();

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

app.get(
  '/api/connection',
  authController.verifySessionCookie,
  // todo: query database for all stored connections, decrypt passwords/intialize kafka instances/pass down chain
  kafkaController.cacheClients,
  (req, res) => {
    return res.status(200).json(/* all cluster connection details to send*/);
  }
);

// create and save a new sever connection for a given user
app.post(
  '/api/connection',
  authController.verifySessionCookie,
  kafkaController.initiateKafka,
  kafkaController.cacheClient,
  // todo: controller(s) to encrypt and store in db
  (req, res) => {
    const {clientId, brokers, ssl, sasl} = res.locals.client;
    return res.status(201).json({
      clientId,
      brokers,
      ssl,
      sasl: {
        mechanism: sasl.mechanism,
        username: sasl.username,
      },
    });
  }
);

app.delete(
  '/api/connection',
  authController.verifySessionCookie,
  authController.clearCachedClient,
  // todo: controller(s) to delete record from db
  (req, res) => {
    return res.status(202).json(/* deleted cluster connection details to send*/);
  }
);

const {getClusterData, getTopicData, getGroupData} = adminController;
app.get('/api/data', getClusterData, getTopicData, getGroupData, (req, res) => {
  return res.status(200).json(res.locals);
});

app.get('/api/:topic/messages', topicController.getMessages, (req, res) => {
  return res.status(200).json(res.locals.topicMessages);
});

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

export {app, clientCache};
