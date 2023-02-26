import path from 'path';
import {fileURLToPath} from 'url';
import * as dotenv from 'dotenv';
import express from 'express';

// import {Kafka} from 'kafkajs';
// import KAFKA_TEST_CONFIG from '../kafka-test-config.js';

const app = express();
const PORT = 5173;

// handle kafka connections here?
// wherever handled, the resulting instances of kafka .admin, .consumer, .producer need to be exported

// create a TEST client that connects to the Kafka server
// const kafka = new Kafka({
//   KAFKA_TEST_CONFIG,
// });

// require routers and controllers here
import adminController from './controllers/adminController.js';
import kafkaController from './controllers/kafkaController.js';

// handle JSON req/res bodies
app.use(express.json());

// server.open in vite.config serves index.html as entry point I think
// keeping this here as backup until I'm sure
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/', express.static(path.resolve(__dirname, '../index.html')));

// routes go here
app.post('/api/connection', kafkaController.initiateKafka, (req, res) => {
  res.sendStatus(201);
});

app.get('/api/stable-data', adminController.getStable, (req, res) => {
  res.status(200).json(res.locals.topicData);
});

app.get('/api/cluster-info', adminController.getClusterData, (req, res) => {
  res.status(200).json(res.locals.clusterData);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: {err: 'An error occurred'},
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default app;
