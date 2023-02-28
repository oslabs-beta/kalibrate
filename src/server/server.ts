import express, {Request, Response, NextFunction} from 'express';
import {errorObject} from './types';
import dotenv from 'dotenv';
dotenv.config();

// Controller imports
import kafkaController from './controllers/kafkaController';
import topicController from './controllers/topicController';
import adminController from './controllers/adminController';

const app = express();

// Parse requests
app.use(express.json());

// server.open in vite.config serves index.html as entry point I think
// keeping this here as backup until I'm sure
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/', express.static(path.resolve(__dirname, '../index.html')));

// Routes
app.post('/api/connection', kafkaController.initiateKafka, (req, res) => {
  res.sendStatus(201);
});

const {getClusterData, getTopicData, getGroupData} = adminController;
app.get('/api/get-data', getClusterData, getTopicData, getGroupData, (req, res) => {
  res.status(200).json(res.locals);
});

app.get('/api/:topic/messages', topicController.getMessages, (req, res) => {
  res.status(200).json(res.locals.topicMessages);
});

// Catch all handler
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  // if kafkaController instance is connected when an error is thrown, disconnect it
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
