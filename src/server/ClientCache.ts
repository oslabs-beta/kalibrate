// caching object for Kafka server instances
interface ClientCache {
  cache: {
    [userId: string]: {
      [clientIdOrLastActive: string]: any; // kafka client object (clientId) or activity timestamp (lastActive)
    };
  };
  clearIntervalId: any; // null or setIntervalId
}

class ClientCache {
  constructor() {
    this.cache = {};
    this.clearIntervalId = null;
  }

  // gets all cached clients for a user
  getAll(userId: number) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    this.cache[userId].lastActive = Date.now(); // timestamp for get, utilized for cache clearances
    return this.cache[userId];
  }

  // gets a single cached client for a user
  getUnique(userId: number, clientId: string) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    if (!Object.hasOwn(this.cache[userId], clientId)) {
      return undefined;
    }

    this.cache[userId].lastActive = Date.now(); // timestamp for get, utilized for cache clearances
    return this.cache[userId][clientId];
  }

  // sets a single cached client for a user
  // connection refers to initialized kafka object
  set(userId: number, clientId: string, connection: any) {
    if (!Object.hasOwn(this.cache, userId)) {
      this.cache[userId] = {};
    }

    this.cache[userId][clientId] = connection;
    this.cache[userId].lastActive = Date.now(); // timestamp for set, utilized for cache clearances

    return this.cache[userId][clientId];
  }

  // sets many cached clients for a user
  // client list refers to an object with key of clientid and value of initialized kafka object
  setMany(userId: number, clientList: any) {
    if (!Object.hasOwn(this.cache, userId)) {
      this.cache[userId] = {};
    }

    for (const clientId in clientList) {
      this.cache[userId][clientId] = clientList[clientId];
    }

    this.cache[userId].lastActive = Date.now(); // timestamp for set, utilized for cache clearances

    return this.cache[userId];
  }

  // delete a cached client for a user
  delete(userId: number, clientId: string) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    if (!Object.hasOwn(this.cache[userId], clientId)) {
      return undefined;
    }

    const connection = this.cache[userId][clientId];
    delete this.cache[userId][clientId];
    this.cache[userId].lastActive = Date.now(); // timestamp for delete, utilized for cache clearances

    return connection;
  }

  // sets an interval to clear the cache (and removes any previously set intervals to clear the cache)
  // takes an interval, which is used to regulate frequency of clearances and how much time must have elapsed without use to be eligible for clearance
  // no return value
  clear(interval: number) {
    this.clearIntervalId = setInterval(() => {
      const now = Date.now();

      for (const user in this.cache) {
        if (this.cache[user].lastActive < now - interval) delete this.cache[user];
      }
    }, interval);
  }

  // removes active interval to clear the cache
  // returns clearIntervalId if successful, undefined if not
  resetClear() {
    if (this.clearIntervalId) {
      clearInterval(this.clearIntervalId);

      const clearIntervalId = this.clearIntervalId;
      this.clearIntervalId = null;

      return clearIntervalId;
    }
  }
}

export default ClientCache;
