'use strict';

const pathResolve = require('path').resolve;

/**
 * クラスやカリー化した高階関数をMixinしキャッシュするクラス
 */
class Components {

  constructor(dirname, defs) {
    this.mixin(this, dirname, defs);
  }

  resolve(func) {
    if (typeof func === 'string') {
      func = require(func);
    }
    if (typeof func === 'object') {
      return func;
    }
    if (typeof func === 'function') {
      if (func.hasOwnProperty('prototype')) {
        // class or func
        return new func(this);
      } else {
        // arrow func
        return func(this);
      }
    }
    throw new Error('Cannot resolved.');
  }

  mixin(target, dirname, obj) {
    Object.keys(obj).forEach(key => {
      const val = obj[key];
      if (typeof val === 'string') {
        const path = val.indexOf('.') === 0 ? pathResolve(dirname, val) : val;
        const ch = key.charAt(0);
        if ('A' <= ch && ch <= 'Z') {
          this.mixinClass(target, path);
        } else {
          this.mixinProperty(target, key, path);
        }
      } else {
        target[key] = val;
      }
    });
  }

  mixinClass(target, path) {
    const val = this.resolve(path);
    if (typeof val === 'object') {
      this.copyMethods(val, target);
    } else {
      throw new Error('Cannot load as class :' + path);
    }
  }

  copyMethods(src, dst) {
    const proto = Object.getPrototypeOf(src);
    if (proto === null) return;
    if (proto.constructor.name !== 'Object') {
      this.copyMethods(proto, dst);
    }
    Object.getOwnPropertyNames(src).forEach(key => {
      if (key === 'constructor') return;
      dst[key] = src[key];
    });
  }

  mixinProperty(target, key, path) {
    Object.defineProperty(target, key, {
      get: () => {
        if (! target._cache) target._cache = {};
        const val = target._cache[key];
        return val || (target._cache[key] = this.resolve(path));
      }
    });
  }
}

module.exports = Components;
