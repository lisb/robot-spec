'use strict';

const RobotCustomEvent = require('./robot-custom-event');
const CombineSpec = require('./combine-spec');
const Cache = require('./cache');

/** メモリキャッシュ */
const cache = new Cache();

/**
 * robotイベントをラップしたパッケージ
 * ## メイン
 * - テキストメッセージの受信内容取得をサポートする
 * ## オプション
 * - 1) 呼び出すコアとなるクラス群をキャッシュしておく
 * - 2) クラス群のコンストラクタまでを実行する
 * spec キャッシュしたクラス群をMixinしたオブジェクト
 * @example
 * const RobotSpec = require('robot-spec');
 * const robot2 = new RobotSpec(robot);
 * robot2.hear('text', ({ res, msg }) => res.send('TEXT >' + msg));
 * // option 1)
 * const robot2 = new RobotSpec(robot).config();
 * // option 2)
 * const robot2 = new RobotSpec(robot).config().initialize();
 * // spec
 * const spec = robot2.spec;
 */
class RobotSpec extends RobotCustomEvent {

  constructor(robot) {
    super(robot);

    this.spec = { };
  }


  /**
   * 呼び出すコアとなるクラス群のキャッシュ
   * @param {?Object} [opts=false] - キャッシュする対象をマップしたファイルの指定パス
   * @param {?string} [key=false] - キャッシュする対象の分類を示すキー
   * @return {this} this
   */
  config(opts = false, key = false) {
    const combineSpec = new CombineSpec(this.robot, opts);
    this.spec = combineSpec.spec;

    // キャッシュに保存
    cache.set(this.spec, key);

    return this;
  }


  /**
   * 呼び出すコアクラス群のコンストラクタ呼び出しまでを実行する
   * @return {this} this
   */
  initialize() {
    Object.getOwnPropertyNames(this.spec).map(method => this.spec[method]);

    return this;
  }

}

module.exports = RobotSpec;

/**
 * キャッシュしたクラス群を渡す
 * @param {?string} key - 対象の分類を示すキー
 */
module.exports.Spec = (key) => cache.get(key);
