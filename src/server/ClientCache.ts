interface ClientCache {
  cache: {
    [userId: string]: {
      [clientId: string]: any; // kafka client object
    };
  };
}

class ClientCache {
  constructor() {
    this.cache = {};
  }

  // gets all cached clients for a user
  getAll(userId: number) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    return this.cache[userId];
  }

  // gets a single cached client for a user
  getUnique(userId: number, clientId: number) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    if (!Object.hasOwn(this.cache[userId], clientId)) {
      return undefined;
    }

    return this.cache[userId][clientId];
  }

  // sets a single cached client for a user
  // connection refers to initialized kafka object
  set(userId: number, clientId: string, connection: any) {
    if (!Object.hasOwn(this.cache, userId)) {
      this.cache[userId] = {};
    }

    this.cache[userId][clientId] = connection;

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

    return connection;
  }
}

export default ClientCache;
