'use strict';

/**
 * robot.hearで抽出したテキストメッセージを処理する関数
 * @param {*} res - robot.response
 * @return {(string|boolean)} 有効なテキストメッセージを返す
 */
module.exports = (res) => {

  const msg = res.match[1] || res.match[0];

  // ペアトークの場合、"Hubot "を取り除く
  const msgTrim = (res.message.roomType === 1)
    ? msg.replace(/^\S+ /, '')
    : msg;


  if (/^\{[\s\S]+\}$/.test(msgTrim)) return false;


  // トークルーム名の変更を対象外に
  if (res.message.id === null) return false;


  // スタンプ、セレクト、ファイル送信を対象外に
  if ((msgTrim.includes('stamp_set') && msgTrim.includes('stamp_index')) ||
      (msgTrim.includes('response') || msgTrim.includes('question')) ||
      (msgTrim.includes('file_id'))) {
    return false;
  }


  // 入力されたテキストメッセージ内容
  return msgTrim;
};
