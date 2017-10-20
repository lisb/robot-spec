'use strict';

const pathResolve = require('path').resolve;
const getType = require('../utils/get-type');
const hearMessage = require('./hear-message');
const regMessage = /([\s\S]+)/;


/**
 * robotイベントをラップした関数
 * 'text'イベントを追加対応し、メッセージの抽出をサポートする
 * @example
 * const robot2 = new RobotSpec(robot);
 * robot2.hear('text', ({ res, msg }) => res.send('TEXT >' + msg));
 * robot2.respond('text', ({ res, msg }) => res.send('TEXT >' + msg));
 */
class RobotCustomEvent {

  constructor(robot) {
    this.robot = robot;
  }


  /**
   * robot.hearをラップしたメソッド
   * @param {RegExp|string} maybeReg - イベントの対象
   * @param {Object} options - listener metadata
   * @param {responseCallback} cb
   */
  hear(maybeReg, options, cb) {
    if (!cb) {
      this.addEventHear(maybeReg, null, options);
    } else {
      this.addEventHear(maybeReg, options, cb);
    }
  }


  /**
   * robot.respondをラップしたメソッド
   * @param {RegExp|string} maybeReg - イベントの対象
   * @param {Object} options - listener metadata
   * @param {responseCallback} cb
   */
  respond(maybeReg, options, cb) {
    if (!cb) {
      this.addEventRespond(maybeReg, null, options);
    } else {
      this.addEventRespond(maybeReg, options, cb);
    }
  }


  addEventHear(maybeReg, options, cb) {

    const type = getType(maybeReg);

    if ('RegExp' === type) {
      const callback = (res) => {
        const msg = hearMessage(res);
        if (!msg) return;

        const m = (new RegExp(maybeReg)).exec(res.match[0]);
        const msgs = m.slice(1, m.length);

        cb({ res, msg, msgs });
      };

      if (!options) {
        this.robot.hear(maybeReg, callback);
      } else {
        this.robot.hear(maybeReg, options, callback);
      }
    }


    if ('String' === type) {
      if ('text' === maybeReg) {
        const callback = (res) => {
          const msg = hearMessage(res);
          if (!msg) return;

          cb({ res, msg });
        };

        if (!options) {
          this.robot.hear(regMessage, callback);
        } else {
          this.robot.hear(regMessage, options, callback);
        }
      } else {
        const callback = (res) => cb({ res });

        if (!options) {
          this.robot.hear(maybeReg, callback);
        } else {
          this.robot.hear(maybeReg, options, callback);
        }
      }
    }

  }


  addEventRespond(maybeReg, options, cb) {

    const type = getType(maybeReg);

    if ('RegExp' === type) {
      const callback = (res) => {
        const msg = hearMessage(res);
        if (!msg) return;

        const removeHubot = match => (/^Hubot /.test(match)) ? match.replace(/^Hubot /, '') : match;
        const m = (new RegExp(maybeReg)).exec(removeHubot(res.match[0]));
        const msgs = m.slice(1, m.length);

        cb({ res, msg, msgs });
      };

      if (!options) {
        this.robot.respond(maybeReg, callback);
      } else {
        this.robot.respond(maybeReg, options, callback);
      }
    }


    if ('String' === type) {
      if ('text' === maybeReg) {
        const callback = (res) => {
          const msg = hearMessage(res);
          if (!msg) return;

          cb({ res, msg });
        };

        if (!options) {
          this.robot.respond(regMessage, callback);
        } else {
          this.robot.respond(regMessage, options, callback);
        }
      } else {
        const callback = (res) => cb({ res });

        if (!options) {
          this.robot.respond(maybeReg, callback);
        } else {
          this.robot.respond(maybeReg, options, callback);
        }
      }
    }

  }

}

module.exports = RobotCustomEvent;
