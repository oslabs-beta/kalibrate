// import path from 'path';
// import {fileURLToPath} from 'url';
import express, {Request, Response, NextFunction} from 'express';
import {errorObject} from './types';
import dotenv from 'dotenv';
dotenv.config();

// Controller imports
import adminController from './controllers/adminController';
import kafkaController from './controllers/kafkaController';

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

app.get('/api/stable-data', adminController.getStable, (req, res) => {
  res.status(200).json(res.locals.topicData);
});

app.get('/api/cluster-info', adminController.getClusterData, (req, res) => {
  res.status(200).json(res.locals.clusterData);
});

// Catch all handler
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
