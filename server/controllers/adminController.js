// coding under the assumption that an instance of kafka.admin gets connected and exported as part of server startup
// IMPORT STATEMENT HERE:
import kafkaController from './kafkaController.js';

const adminController = {};

adminController.getClusterData = async (req, res, next) => {
  // console.log('hello from get cluster');
  // get cluster info
  try {
    // attempt to connect admin to instance of kafka
    console.log('kafka instance? ', kafkaController.kafka);
    const admin = kafkaController.kafka.admin();
    await admin.connect();
    res.locals.clusterData = await admin.describeCluster();
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: 'adminController.getClusterData failed to get cluster details',
      status: 400,
      message: err,
    });
  }
};

adminController.getStable = async (req, res, next) => {
  // console.log('hello from getstable');
  // console.log('hello from getstable');
  // declare variables scoped for access from all try blocks
  let topicList, topicMetadata, admin;

  // get array of topics
  try {
    // attempt to connect admin to instance of kafka - use var to escape block scope
    admin = kafkaController.kafka.admin();
    await admin.connect();

    topicList = await admin.listTopics();
    // console.log('topiclist: ', topicList);

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
    // console.log('metadata: ', JSON.stringify(topicMetadata));
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
    console.log('rlocals: ', res.locals.topicData);
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
