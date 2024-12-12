function createSemaphore(initialKeys) {
  const state = {
    keys: initialKeys,
    queue: []
  };

  const acquire = async () => {
    if (state.keys.length > 0) {
      const key = state.keys.shift();
      return Promise.resolve(key);
    } else {
      return new Promise(resolve => state.queue.push(resolve));
    }
  };

  const release = (key) => {
    if (state.queue.length > 0) {
      const next = state.queue.shift();
      next(key);
    } else {
      state.keys.push(key);
    }
  };

  const getAvailableKeys = () => {
    return state.keys.length;
  };

  return {
    acquire,
    release,
    getAvailableKeys
  };
}

module.exports = createSemaphore;