import {topicMessage} from './types';

interface ConsumerCache {
  cache: {
    [userId: string]: {
      [clientId: string]: {
        [topic: string]: topicMessage[];
      };
    };
  };
}

class ConsumerCache {
  constructor() {
    this.cache = {};
  }

  // gets messages for a single cached topic
  get(userId: number, clientId: string, topic: string) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    if (!Object.hasOwn(this.cache[userId], clientId)) {
      return undefined;
    }

    if (!Object.hasOwn(this.cache[userId][clientId], topic)) {
      return undefined;
    }

    return this.cache[userId][clientId][topic];
  }

  // push a new cached message
  add(userId: number, clientId: string, topic: string, message: topicMessage) {
    if (!Object.hasOwn(this.cache, userId)) {
      this.cache[userId] = {};
    }

    if (!Object.hasOwn(this.cache[userId], clientId)) {
      this.cache[userId][clientId] = {};
    }

    if (!Object.hasOwn(this.cache[userId][clientId], topic)) {
      this.cache[userId][clientId][topic] = [];
    }

    this.cache[userId][clientId][topic].push(message);

    return this.cache[userId][clientId][topic].length;
  }

  // delete a cached messages for a given topic
  delete(userId: number, clientId: string, topic: string) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    if (!Object.hasOwn(this.cache[userId], clientId)) {
      return undefined;
    }

    if (!Object.hasOwn(this.cache[userId][clientId], topic)) {
      return undefined;
    }

    const messages = this.cache[userId][clientId][topic];
    delete this.cache[userId][clientId][topic];

    return messages;
  }
}

export default ConsumerCache;
