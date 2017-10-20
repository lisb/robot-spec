'use strict';

const getType = require('../utils/get-type');
const safeLoadModule = require('../utils/safe-load-module');
const Components = require('./components');

/**
 * パスの初期値
 * @type {Object}
 * @property {string} defaultSetting.root
 * @property {string} defaultSetting.config
 * @property {string} defaultSetting.components
 */
const defaultSetting = {
  root      : 'src/',
  config    : 'src/config',
  components: 'src/components'
};


/**
 * 指定されたモジュール群をMixin&キャッシュするクラス
 */
class CombineSpec {

  /**
   * @param {robot} robot
   * @param {Object} opts - 設定情報
   * @param {string} opts.root - ミドルウェアに該当するコードのルートディレクトリのパス
   * @param {string} opts.config - 主に定数を設定するモジュールのパス
   * @param {string} opts.components - コアとなるモジュール群を指定したオブジェクトモジュールのパス
   */
  constructor(robot, opts) {
    this.robot = robot;
    this.spec = { };

    this.config(opts);
    this.setSpec();
  }


  /**
   * 各設定モジュールの読み込みを行うメソッド
   * @param {Object} [opts=false] - 設定情報
   */
  config(opts = false) {
    const checkType = (item) => {
      if (false === item) return true;
      if ('String' === getType(item)) return true;
      return false;
    };
    const root       = (!!opts && checkType(opts.root)) ? opts.root : defaultSetting.root;
    const config     = (!!opts && checkType(opts.config)) ? opts.config : defaultSetting.config;
    const components = (!!opts && checkType(opts.components)) ? opts.components : defaultSetting.components;

    this.setting = {
      root,
      config    : (!!config ? safeLoadModule(config) : { }),
      components: safeLoadModule(components)
    };
  }


  /**
   * モジュール群をMixinしキャッシュするメソッド
   * 設定情報の有無によって、処理した対象の名称をログ出力する
   */
  setSpec() {

    if (!this.setting.components) {
      if (!!this.setting.config) {
        this.spec = { config: this.setting.config };

        this.robot.logger.info('Ready spec... only [config]');
      } else {
        this.robot.logger.info('Ready spec... none');
      }
    } else {

      this.spec = new Components(this.setting.root, this.setting.components(this.robot, this.setting.config));

      this.robot.logger.info('Ready spec... [' + Object.getOwnPropertyNames(this.spec).join('/') + ']');
    }

  }

}

module.exports = CombineSpec;
