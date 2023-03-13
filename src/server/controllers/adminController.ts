import {controller, OffsetCollection} from './../types';

const adminController: controller = {};

// get cluster info
adminController.getClusterData = async (req, res, next) => {
  const {kafka} = res.locals;
  let admin; // outer scoped so can disconnect in case of error

  // attempt to connect admin to instance of kafka
  try {
    admin = kafka.admin();
    await admin.connect();

    // if successful fetch cluster data
    res.locals.clusterData = await admin.describeCluster();

    return next();
  } catch (err) {
    if (admin) await admin.disconnect();

    return next({
      log: `ERROR - adminController.getClusterData failed to get cluster data: ${err}`,
      status: 400,
      message: {err: 'Failed to connect to Kafka cluster'},
    });
  }
};

// get topic metadata
adminController.getTopicData = async (req, res, next) => {
  const {kafka} = res.locals;
  let topicList, topicMetadata, admin; // outer scoped so can disconnect in case of error

  // get array of topics
  try {
    // attempt to connect admin to instance of kafka
    admin = kafka.admin();
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
      log: `ERROR - adminController.getTopicData failed to get list of topics: ${err}`,
      status: 400,
      message: {err: 'Failed to connect to Kafka cluster'},
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
      log: `ERROR - adminController.getTopicData failed to get topic metadata: ${err}`,
      status: 400,
      message: {err: 'Failed to fetch Kafka cluster topic metadata'},
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
      log: `ERROR - adminController.getTopicData failed to add offset data to topic offsets: ${err}`,
      status: 400,
      message: {err: 'Failed to fetch Kafka cluster topic metadata'},
    });
  }

  try {
    res.locals.topicData = topicMetadata;
    await admin.disconnect();

    return next();
  } catch (err) {
    return next({
      log: `ERROR - adminController.getTopicData failed to pass data back on res.local: ${err}`,
      status: 400,
      message: {err: 'Failed to fetch Kafka cluster topic metadata'},
    });
  }
};

// get group data
adminController.getGroupData = async (req, res, next) => {
  const {kafka} = res.locals;
  let admin; // outer scoped so can disconnect in case of error

  try {
    // attempt to connect admin to instance of kafka
    admin = kafka.admin();
    await admin.connect();

    const listObj = await admin.listGroups();
    res.locals.groupList = listObj.groups;

    // if there are no groups present, return nothing
    if (res.locals.groupList.length === 0) {
      res.locals.groupData = [];

      return next();
    } else {
      const groupIds: string[] = res.locals.groupList.map(
        (group: {[k: string]: string}) => group.groupId
      );

      const groupData = await admin.describeGroups(groupIds);

      // iterate through res.locals.groupList; for each, call fetchoffsets
      // use for loop because forEach doesn't work asynchronously
      const groupOffsets: OffsetCollection = {};
      for (const el of groupIds) {
        groupOffsets[el] = await admin.fetchOffsets({groupId: el});
      }

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

    return next({
      log: `ERROR - adminController.describeGroups failed to get cluster group data: ${err}`,
      status: 400,
      message: {err: 'Failed to fetch cluster group data'},
    });
  }
};

export default adminController;
