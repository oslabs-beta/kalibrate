import {consumerCache} from '../server';
import {controller} from '../types';
import {consumedTopicPartitions} from '../types';

const consumerCacheTimeout = 1200000; // 20 mins in ms
const consumerController: controller = {};

consumerController.getMessages = async (req, res, next) => {
  const {id} = res.locals.user;
  const {topic, clientId} = req.params;
  const {kafka} = res.locals;

  if (res.locals.topicMessages) return next(); // move on if cache hit for messages

  // if cache miss from prior middleware run consumer
  const messageAdmin = kafka.admin();
  const messageConsumer = kafka.consumer({groupId: `kalibrate-${id}-${clientId}-${topic}`});

  try {
    // attempt to disconnect before starting as failsafe
    await messageAdmin.disconnect();
    await messageConsumer.disconnect();

    // reset offsets for consumer group 'kalibrate'
    // necessary to fetch all messages from the earliest offset on repeated requests
    await messageAdmin.connect();
    await messageAdmin.resetOffsets({
      groupId: `kalibrate-${id}-${clientId}-${topic}`,
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

    // when all messages have been consumed, keep client caching for timeout but send response of current cache
    const removeBatchListener = messageConsumer.on(
      messageConsumer.events.END_BATCH_PROCESS,
      async ({payload}: any) => {
        const {topic, partition, offsetLag} = payload;
        consumedTopicPartitions[`${topic}-${partition}`] = offsetLag === '0';

        if (Object.values(consumedTopicPartitions).every(consumed => Boolean(consumed))) {
          let cachedMessages = consumerCache.get(id, clientId, topic); // get current value of cache
          if (cachedMessages) cachedMessages = [...cachedMessages].reverse(); // reverse copy to get most recent first
          res.locals.topicMessages = cachedMessages;

          // end consumer instances and clear cache after 20min timeout
          setTimeout(async () => {
            await messageConsumer.disconnect();
            consumerCache.delete(id, clientId, topic);
          }, consumerCacheTimeout);

          removeBatchListener(); // remove the listener
          return next();
        }
      }
    );

    // consume messages from earliest offset and push them to array to send back
    await messageConsumer.subscribe({topic, fromBeginning: true});
    await messageConsumer.run({
      eachMessage: async ({messageTopic, partition, message}: any) => {
        const topicMessage = {
          topic: messageTopic,
          partition: partition,
          timestamp: message.timestamp,
          offset: message.offset,
          key: message.key.toString(),
          value: message.value.toString(), // should be left as string since type could vary
        };

        consumerCache.add(id, clientId, topic, topicMessage); // add to cache
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

consumerController.checkConsumerCache = (req, res, next) => {
  const {id} = res.locals.user;
  const {clientId, topic} = req.params;

  const cachedMessages = consumerCache.get(id, clientId, topic); // store if cache hit
  if (cachedMessages) res.locals.topicMessages = [...cachedMessages].reverse(); // reverse copy to get most recent first

  return next();
};

export default consumerController;
