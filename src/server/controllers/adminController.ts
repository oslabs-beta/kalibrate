import kafkaController from './kafkaController';
import {controller, OffsetCollection} from './../types';

const adminController: controller = {};

// get cluster info
adminController.getClusterData = async (req, res, next) => {
  let admin;
  try {
    // attempt to connect admin to instance of kafka
    admin = kafkaController.kafka.admin();
    await admin.connect();
    res.locals.clusterData = await admin.describeCluster();
    return next();
  } catch (err) {
    await admin.disconnect();
    return next({
      log: 'adminController.getClusterData failed to get cluster details',
      status: 400,
      message: err,
    });
  }
};

// get topic metadata
adminController.getTopicData = async (req, res, next) => {
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
    await admin.disconnect();
    return next({
      log: 'adminController.getTopicData failed to get list of topics',
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
    await admin.disconnect();
    return next({
      log: 'adminController.getTopicData failed to get topic metadata',
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
    await admin.disconnect();
    return next({
      log: 'adminController.getTopicData failed to add offset data to topic metadata',
      status: 400,
      message: err,
    });
  }

  try {
    res.locals.topicData = topicMetadata;
    await admin.disconnect();
    return next();
  } catch (err) {
    return next({
      log: 'adminController.getTopicData failed to pass data back on res.local',
      status: 400,
      message: err,
    });
  }
};

// get group data
adminController.getGroupData = async (req, res, next) => {
  let admin;
  try {
    // attempt to connect admin to instance of kafka
    admin = kafkaController.kafka.admin();
    await admin.connect();
    const listObj = await admin.listGroups();
    res.locals.groupList = listObj.groups;

    // if there are no groups present, return nothing
    if (res.locals.groupList.length === 0) {
      res.locals.groups = [];
      return next();
    } else {
      const groupIds: string[] = res.locals.groupList.map(
        (group: {[k: string]: string}) => group.groupId
      );

      const groupData = await admin.describeGroups(groupIds);

      // iterate through res.locals.groupList; for each, call fetchoffsets
      // using for loop because forEach doesn't work asynchronously
      const groupOffsets: OffsetCollection = {};
      for (const el of groupIds) {
        console.log('current group: ', el);
        groupOffsets[el] = await admin.fetchOffsets({groupId: el});
      }

      console.log(JSON.stringify(res.locals.groupOffsets));
      res.locals.groupOffsets = groupOffsets;

      // convert buffers for metadata and assignment
      res.locals.groupData = groupData.groups.map((group: any) => {
        group.members = group.members.map((member: any) => {
          member.memberMetadata = member.memberMetadata.toString();
          member.memberAssignment = member.memberAssignment.toString();
          return member;
        });
        return group;
      });

      return next();
    }
  } catch (err) {
    await admin.disconnect();
    console.log(err);
    return next({
      log: 'adminController.describeGroups failed to get group details',
      status: 400,
      message: err,
    });
  }
};

export default adminController;
