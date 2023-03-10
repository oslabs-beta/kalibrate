import kafkaController from './kafkaController';
import {controller} from './../types';


const topicController: controller = {};

topicController.createTopic = async (req, res, next) => {
  // declare admin
  let admin;
  console.log('hello from create topic');
  try {
    // grab info needed to create new topic with partitions

    const {newTopicName, numPartitions} = req.body;
    console.log(req.body, "req.body");
    // connect to admin
    admin = kafkaController.kafka.admin();
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

    // invoke create partitions
    // await admin.createPartitions({
    //   topicPartitions: [
    //     {
    //       topics: {
    //         topic: newTopicName,
    //         count: numPartitions,
    //       },
    //       count: 1,
    //     },
    //   ],
    // });

    //disconnect admin
    await admin.disconnect();
    // return next
    return next();

    // error catching
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
  let admin;
  console.log('hello from deleteTopic');

  try {
    //connect to admin
    admin = kafkaController.kafka.admin();
    await admin.connect();

    //grab topic to delete from req body
    const {deleteTopicArray} = req.body;
    console.log('delete topic array from controller',deleteTopicArray);
    console.log(req.body);


    //delete topic
    await admin.deleteTopics({
      topics: req.body,
    });

    //disconnect from admin
    await admin.disconnect();

    //return next
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
