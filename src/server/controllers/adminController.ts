import kafkaController from './kafkaController';
import {controller} from './../types';

const adminController: controller = {};

// get cluster info
adminController.getClusterData = async (req, res, next) => {
  try {
    // attempt to connect admin to instance of kafka
    const admin = kafkaController.kafka.admin();
    await admin.connect();

    res.locals.clusterData = await admin.describeCluster();
    return next();
  } catch (err) {
    return next({
      log: 'adminController.getClusterData failed to get cluster details',
      status: 400,
      message: err,
    });
  }
};

// get topic metadata
adminController.getStable = async (req, res, next) => {
  // declare variables scoped for access from all try blocks
  let topicList, topicMetadata, admin;

  // get array of topics
  try {
    // attempt to connect admin to instance of kafka - use var to escape block scope
    admin = kafkaController.kafka.admin();
    await admin.connect();

    topicList = await admin.listTopics();

    // if there are no topics in the cluster, return an empty array
    if (topicList.length === 0) {
      res.locals.topicData = [];
      return next();
    }
  } catch (err) {
    return next({
      log: 'adminController.getStable failed to get list of topics',
      status: 400,
      message: err,
    });
  }

  // use topics array to get metadata
  try {
    topicMetadata = await admin.fetchTopicMetadata({
      topics: topicList,
    });
  } catch (err) {
    return next({
      log: 'adminController.getStable failed to get topic metadata',
      status: 400,
      message: err,
    });
  }

  // get array of partitions and offsets for each topic
  // for each object in the topicMetadata array,
  // use its unique topic name to fetch offsets for that topic
  // store the result as a new offsets property on that object
  try {
    for (let topic of topicMetadata.topics) {
      topic.offsets = await admin.fetchTopicOffsets(topic.name);
    }
  } catch (err) {
    return next({
      log: 'adminController.getStable failed to add offset data to topic metadata',
      status: 400,
      message: err,
    });
  }

  try {
    res.locals.topicData = topicMetadata;
    return next();
  } catch (err) {
    return next({
      log: 'adminController.getStable failed to pass data back on res.local',
      status: 400,
      message: err,
    });
  }
};

/*
The resulting array should consist of objects of this form:
{
  name: String,
  partitions: [{
    partitionErrorCode: Number,
    partitionId: Number,
    leader: Number,
    replicas: [Numbers],
    isr: [Numbers]
  }],
  offsets: [{
    partition: Number,
    offset: String,
    high: String,
    low: String
  }],
}
*/

export default adminController;
