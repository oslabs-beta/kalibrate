import path from 'path';
import {fileURLToPath} from 'url';
import express from 'express';
import adminController from './controllers/adminController.js';

const app = express();
const PORT = 5173;

// handle kafka connections here?
// wherever handled, the resulting instances of kafka .admin, .consumer, .producer need to be exported

// require routers and controllers here

// handle JSON req/res bodies
app.use(express.json());

// server.open in vite.config serves index.html as entry point I think
// keeping this here as backup until I'm sure
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/', express.static(path.resolve(__dirname, '../index.html')));

// routes go here
app.get('/stable-data', adminController.getStable, (req, res) => {
  res.send(200).json(res.locals.topicData);
});

app.get('/cluster-info', adminController.getClusterData, (req, res) => {
  res.send(200).json(res.locals.clusterData);
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
