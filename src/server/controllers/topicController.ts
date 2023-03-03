import kafkaController from './kafkaController';
import {controller} from './../types';
import {topicMessage} from './../types';
import {consumedTopicPartitions} from './../types';

const topicController: controller = {};

topicController.getMessages = async (req, res, next) => {
  const topic = req.params.topic;
  const messageAdmin = kafkaController.kafka.admin();
  const messageConsumer = kafkaController.kafka.consumer({groupId: 'kalibrate'});
  const topicMessages: topicMessage[] = [];

  try {
    // attempt to disconnect in case a client was left connected from a failed previous request
    await messageAdmin.disconnect();
    await messageConsumer.disconnect();

    // reset offsets for consumer group 'kalibrate'
    // necessary to fetch all messages from the earliest offset on repeated requests
    await messageAdmin.connect();
    await messageAdmin.resetOffsets({
      groupId: 'kalibrate',
      topic: req.params.topic,
      earliest: true,
    });
    await messageAdmin.disconnect();

    // fetch all messages from topic as of the moment of request
    // modified the approach from here: https://github.com/tulios/kafkajs/issues/825
    let consumedTopicPartitions: consumedTopicPartitions = {};

    // object to track whether messages have been consumed per given partition
    messageConsumer.on(messageConsumer.events.GROUP_JOIN, async ({payload}: any) => {
      const {memberAssignment} = payload;

      consumedTopicPartitions = Object.entries(memberAssignment).reduce(
        (topics: consumedTopicPartitions, [topic, partitions]: any) => {
          for (const partition in partitions) {
            topics[`${topic}-${partition}`] = false;
          }
          return topics;
        },
        {}
      );
    });

    // save array of messages and disconnect when all messages have been consumed
    messageConsumer.on(messageConsumer.events.END_BATCH_PROCESS, async ({payload}: any) => {
      const {topic, partition, offsetLag} = payload;
      consumedTopicPartitions[`${topic}-${partition}`] = offsetLag === '0';

      if (Object.values(consumedTopicPartitions).every(consumed => Boolean(consumed))) {
        res.locals.topicMessages = topicMessages.reverse();
        await messageConsumer.disconnect();
        return next();
      }
    });

    // consume messages from earliest offset and push them to array to send back
    await messageConsumer.subscribe({topic, fromBeginning: true});
    await messageConsumer.run({
      eachMessage: async ({topic, partition, message}: any) => {
        const topicMessage = {
          topic: topic,
          partition: partition,
          timestamp: message.timestamp,
          offset: message.offset,
          key: message.key.toString(),
          value: message.value.toString(), // should be left as string since type could vary
        };

        topicMessages.push(topicMessage);
      },
    });
  } catch (err) {
    next({
      log: `ERROR - topicController.getMessages: ${err}`,
      status: 400,
      message: {err: 'Failed to retrieve messages.'},
    });
  }
};

export default topicController;
