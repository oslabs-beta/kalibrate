// coding under the assumption that an instance of kafka.admin gets connected and exported as part of server startup
// IMPORT STATEMENT HERE:
import kafkaController from './kafkaController';

const adminController = {};

adminController.getClusterData = async (req, res, next) => {
  // get cluster info
  try {
    // attempt to connect admin to instance of kafka
    console.log('kafka instance? ', kafkaController.kafka);
    const admin = kafkaController.kafka.admin();
    await admin.connect();
    res.locals.clusterData = await admin.describeCluster();
    return next();
  } catch (err) {
    return next({
      log: 'adminController.getClusterData failed to get cluster details',
      status: 400,
      message: 'Failed to get static data from cluster',
    });
  }
};

adminController.getStable = async (req, res, next) => {
  // get array of topics
  try {
        // attempt to connect admin to instance of kafka
    console.log('kafka instance? ', kafkaController.kafka);
    const admin = kafkaController.kafka.admin();
    await admin.connect()
    const topicList = await admin.listTopics();
    console.log(topicList);
  } catch (err) {
    return next({
      log: 'adminController.getStable failed to get list of topics',
      status: 400,
      message: 'Failed to get static data from cluster',
    });
  }

  // use topics array to get metadata
  try {
    const topicMetadata = await admin.fetchTopicMetadata(topicList);
    console.log(JSON.stringify(topicMetadata));
  } catch (err) {
    return next({
      log: 'adminController.getStable failed to get topic metadata',
      status: 400,
      message: 'Failed to get static data from cluster',
    });
  }

  // get array of partitions and offsets for each topic
  // for each object in the topicMetadata array,
  // use its unique topic ame to fetch offsets for that topic
  // store the result as a new offsets property on that object
  try {
    for (let topic of topicMetadata) {
      topicMetadata[topic].offsets = await admin.fetchTopicOffsets(topicMetadata.name);
    }
  } catch (err) {
    return next({
      log: 'adminController.getStable failed to add offset data to topic metadata',
      status: 400,
      message: 'Failed to get static data from cluster',
    });
  }
  try {
    res.locals.topicData = topicMetadata;
    return next();
  } catch (err) {
    return next({
      log: 'adminController.getStable failed to pass data back on res.local',
      status: 400,
      message: 'Failed to get static data from cluster',
    });
  }
};

/*
The resulting array should consist of objects of this form:
{name: String,
partitions: [{
  partitionErrorCode: Number,
  partitionId: Number,
  leader: Number,
  replicas: [Numbers],
  isr: [Numbers]
},
offsets: [{
  partition: Number,
  offset: String,
  high: String,
  low: String
}]
]}

*/

export default adminController;
