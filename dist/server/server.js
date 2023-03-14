"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumerCache = exports.clientCache = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ClientCache_1 = __importDefault(require("./ClientCache"));
const ConsumerCache_1 = __importDefault(require("./ConsumerCache"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Controller imports
const kafkaController_1 = __importDefault(require("./controllers/kafkaController"));
const consumerController_1 = __importDefault(require("./controllers/consumerController"));
const adminController_1 = __importDefault(require("./controllers/adminController"));
const authController_1 = __importDefault(require("./controllers/authController"));
const clusterController_1 = __importDefault(require("./controllers/clusterController"));
const topicController_1 = __importDefault(require("./controllers/topicController"));
// Constants
const PORT = process.env.PORT || '5173';
// Create rate limiter for connection requests: max 5 per IP address within one minute
const connectionLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60000,
    max: 5,
    message: 'Exceeded the number of allowed connection attempts. Please try again in a few minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});
// Create caches
const clientCache = new ClientCache_1.default();
exports.clientCache = clientCache;
clientCache.clear(1800000); // clear inactive clients from cache every 30 min
const consumerCache = new ConsumerCache_1.default();
exports.consumerCache = consumerCache;
// Instantiate server
const app = (0, express_1.default)();
exports.app = app;
// Serve client production bundle
app.use('/client', express_1.default.static(path_1.default.resolve(__dirname, '..', 'client')));
// Parse requests
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// User account routes
app.post('/api/signup', authController_1.default.createUser, authController_1.default.setSessionCookie, (req, res) => {
    const { user } = res.locals;
    return res.status(201).json(user);
});
app.post('/api/login', authController_1.default.verifyUser, authController_1.default.setSessionCookie, (req, res) => {
    const { user } = res.locals;
    return res.status(201).json(user);
});
app.get('/api/reset', authController_1.default.verifySessionCookie, authController_1.default.clearSessionCookie, (req, res) => {
    return res.sendStatus(200);
});
app.get('/api/session', authController_1.default.verifySessionCookie, (req, res) => {
    return res.sendStatus(200);
});
app.patch('/api/settings/account', authController_1.default.verifySessionCookie, authController_1.default.updateUser, (req, res) => {
    return res.sendStatus(200);
});
// Kafka server instance routes
app.get('/api/connection', authController_1.default.verifySessionCookie, clusterController_1.default.getClientConnections, kafkaController_1.default.cacheClients, (req, res) => {
    const clients = res.locals.clientCredentials;
    return res.status(200).json(clients);
});
app.post('/api/connection', connectionLimiter, // rate-limit connection attempts
authController_1.default.verifySessionCookie, kafkaController_1.default.initiateKafka, kafkaController_1.default.cacheClient, clusterController_1.default.storeClientConnection, (req, res) => {
    let { clientId, brokers, ssl, sasl } = res.locals.client;
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
});
app.delete('/api/connection', authController_1.default.verifySessionCookie, kafkaController_1.default.clearCachedClient, clusterController_1.default.deleteClientConnection, (req, res) => {
    return res.sendStatus(204);
});
// Kafka server data routes
app.get('/api/data/:clientId', authController_1.default.verifySessionCookie, kafkaController_1.default.getCachedClient, clusterController_1.default.getClientConnection, kafkaController_1.default.cacheClient, kafkaController_1.default.getCachedClient, adminController_1.default.getClusterData, adminController_1.default.getTopicData, adminController_1.default.getGroupData, (req, res) => {
    const { clusterData, topicData, groupList, groupData, groupOffsets } = res.locals;
    const data = { clusterData, topicData, groupList, groupData, groupOffsets };
    return res.status(200).json(data);
});
app.post('/api/:clientId/topic', authController_1.default.verifySessionCookie, kafkaController_1.default.getCachedClient, clusterController_1.default.getClientConnection, kafkaController_1.default.cacheClient, kafkaController_1.default.getCachedClient, topicController_1.default.createTopic, adminController_1.default.getTopicData, (req, res) => {
    return res.status(200).json(res.locals.topicData);
});
app.delete('/api/:clientId/topic', authController_1.default.verifySessionCookie, kafkaController_1.default.getCachedClient, clusterController_1.default.getClientConnection, kafkaController_1.default.cacheClient, kafkaController_1.default.getCachedClient, topicController_1.default.deleteTopic, adminController_1.default.getTopicData, (req, res) => {
    return res.status(200).json(res.locals.topicData);
});
app.get('/api/messages/:clientId/:topic', authController_1.default.verifySessionCookie, consumerController_1.default.checkConsumerCache, kafkaController_1.default.getCachedClient, clusterController_1.default.getClientConnection, kafkaController_1.default.cacheClient, kafkaController_1.default.getCachedClient, consumerController_1.default.getMessages, (req, res) => {
    return res.status(200).json(res.locals.topicMessages);
});
// Catch all to serve app
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '..', 'index.html'));
});
// Global error handler
app.use(async (err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign(defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});
// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
