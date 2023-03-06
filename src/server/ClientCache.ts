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

  getAll(userId: number) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    return this.cache[userId];
  }

  getUnique(userId: number, clientId: number) {
    if (!Object.hasOwn(this.cache, userId)) {
      return undefined;
    }

    if (!Object.hasOwn(this.cache[userId], clientId)) {
      return undefined;
    }

    return this.cache[userId][clientId];
  }

  set(userId: number, clientId: string, connection: any) {
    if (!Object.hasOwn(this.cache, userId)) {
      this.cache[userId] = {};
    }

    this.cache[userId][clientId] = connection;

    return this.cache[userId][clientId];
  }

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
