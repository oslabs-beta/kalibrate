import express, {Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import {errorObject} from './types';
import dotenv from 'dotenv';
dotenv.config();

// Controller imports
import kafkaController from './controllers/kafkaController';
import topicController from './controllers/topicController';
import adminController from './controllers/adminController';
import authController from './controllers/authController';
import clusterController from './controllers/clusterController';

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

app.post('/api/connection', kafkaController.initiateKafka, (req, res) => {
  return res.sendStatus(201);
});

const {getClusterData, getTopicData, getGroupData} = adminController;
app.get('/api/data', getClusterData, getTopicData, getGroupData, (req, res) => {
  console.log('Res Locals post app data retrieval', res.locals);
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

export default app;
