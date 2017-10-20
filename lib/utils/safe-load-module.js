'use strict';

const pathResolve = require('path').resolve;


/**
 * 指定パスのモジュールを読み込むパッケージ
 * @example
 * const somethingModule = safeLoadModule('./something-module');
 * @param {string} modulePath - 読み込むモジュールのパス
 * @return {*} 読み込んだモジュール/読み込めない場合はfalse
 */
module.exports = (modulePath) => {
  try {
    return require(pathResolve(modulePath));
  } catch (err) {
    console.log(err);
    return false;
  }
};
