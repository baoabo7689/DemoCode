class Cache {
  constructor() {
    /**
     * @type {Object.<Number | String, {value: any, timeout: Number, expire: Number}>}
     */
    this.storage = {};
  }

  /**
   * @param {String | Number} key
   * @param value
   * @param {{timeout: Number, timeoutCallback: function(key: String, value)}?} options
   */
  put(key, value, options) {
    const opts = Object.assign({ timeout: 0, timeoutCallback: null }, options);
    const record = {
      value,
      expire: opts.timeout ? Date.now() + opts.timeout : 0,
      timeout: 0,
    };

    if (record.expire) {
      const handleTimeout = function () {
        opts.timeoutCallback && opts.timeoutCallback(key, value);
        this.del(key);
      }.bind(this);

      record.timeout = setTimeout(handleTimeout.bind(this), opts.timeout);
    }

    this.del(key);
    this.storage[key] = record;
  }

  get(key) {
    const data = this.storage[key];

    if (data && (!data.expire || data.expire >= Date.now())) {
      return data.value;
    } else {
      this.del(key);
    }

    return null;
  }

  del(key) {
    const record = this.storage[key];

    if (record) {
      record.timeout && clearTimeout(record.timeout);
      delete this.storage[key];
    }
  }
}

const memoryCache = new Cache();

/**
 * @template {T}
 * @param {String} key
 * @param {function(): Promise<T>} getFromOtherResource
 * @param {Number} timeout
 */
const getValue = async (key, getFromOtherResource, options) => {
  const valueFromCache = memoryCache.get(key);

  if (valueFromCache) {
    return valueFromCache;
  }

  const value = await getFromOtherResource();
  memoryCache.put(key, value, options);

  return value;
};

module.exports = {
  instance: memoryCache,
  getValue,
};
