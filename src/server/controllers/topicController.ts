import {controller} from './../types';

const topicController: controller = {};

topicController.createTopic = async (req, res, next) => {
  // declare admin
  const {kafka} = res.locals;

  try {
    // grab info needed to create new topic with partitions
    const {newTopicName, numPartitions} = req.body;

    // connect to admin
    const admin = kafka.admin();
    await admin.connect();

    // invoke create topics
    await admin.createTopics({
      topics: [
        {
          topic: newTopicName,
          numPartitions: numPartitions,
          replicationFactor: 1,
        },
      ],
    });

    //disconnect admin
    await admin.disconnect();

    return next();
  } catch (err) {
    next({
      log: `ERROR - topicController.createTopic: ${err}`,
      status: 400,
      message: {err: 'Failed to create topic'},
    });
  }
};

topicController.deleteTopic = async (req, res, next) => {
  // declare admin
  const {kafka} = res.locals;

  try {
    //connect to admin
    const admin = kafka.admin();
    await admin.connect();

    //delete topic
    await admin.deleteTopics({
      topics: req.body,
    });

    //disconnect from admin
    await admin.disconnect();

    return next();
  } catch (err) {
    next({
      log: `ERROR - topicController.deleteTopic: ${err}`,
      status: 400,
      message: {err: 'Failed to delete topic'},
    });
  }
};

export default topicController;
