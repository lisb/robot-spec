'use strict';

/**
 * メモリキャッシュ
 */
function Cache() {
  const _cache = Object.create(null);
  const defaultKey = 'default';

  this.get = function(key) {
    key = !!key ? key : defaultKey;

    return _cache[key];
  };

  this.set = function(value, key) {
    key = !!key ? key : defaultKey;

    _cache[key] = value;
    return value;
  }
}

module.exports = Cache;
