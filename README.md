# RobotSpec
メッセージ受信イベントの正規表現の省略や、受信したテキストメッセージ内容の取得を容易に行うことができるdaab開発の為のパッケージ
---

## Requre
node6+  


## Usage

・メッセージ内容の簡易取得

`scripts/app.js`  

```js
const RobotSpec = require('robot-spec');


module.exports = (robot) => {

  const robot2 = new RobotSpec(robot);

  robot2.hear(/PING$/i, ({ res, msg }) => {
    res.send('.PONG > ' + msg);
  });

  robot2.hear('text', ({ res, msg }) => {
    res.send('.TEXT > ' + msg);
  });

  robot2.hear('select', ({ res }) => {
    res.send('.SELECT-STAMP ');
  });

  robot2.respond(/ECHO (.*)_(.*)/i, ({ res, msg, msgs }) => {
    res.send('.ECHO INPUT >\n' + msgs.join('\n'));
  });

};
```

・メソッドのキャッシュと呼び出し

`scripts/app.js`  

```js
const RobotSpec = require('robot-spec');


module.exports = (robot) => {

  const robot2 = new RobotSpec(robot).config();
  const spec = robot2.spec;


  robot2.hear('text', ({ res, msg }) => spec.scenario.textReceive({ res, msg }));
  robot2.hear('select', ({ res }) => spec.scenario.selectReceive({ res }));
  robot2.hear('stamp', ({ res }) => spec.scenario.stampReceive({ res }));

  robot.hear(/PING$/i, (res) => {
    res.send('PONG');
  });

  robot2.respond(/TEST (.*)_(.*)/i, ({ res, msg, msgs }) => {
    res.send('test!\n' + msgs.join('\n'));
  });

  robot2.hear(/TEST (.*)_(.*)/i, ({ res, msg, msgs }) => {
    res.send('test!!\n' + msgs.join('\n'));
    console.log(msg, msgs);
  });

};
```

・メソッドの初期化を行う（constructorの実行）

`initialize`  

```js
const robot2 = new RobotSpec(robot).config().initialize();
const spec = robot2.spec;
```



## robot2.spec

キャッシュしたメソッドの利用

`scripts/app.js`  

```js
const robot2 = new RobotSpec(robot).config();
const spec = robot2.spec;

spec.scenario.method();
// or
robot2.hear('stamp', ({ res }) => spec.scenario.method());
```

別のモジュールではもう一度呼び出して使用することも可能

```js
const spec = require('robot-spec').Spec();

spec.scenario.method();
```



## コンポーネント設定

ディレクトリ構造

```tree
scripts/app.js
src
├── components.js
```

コアメソッドのキャッシュ  

`src/components.js`  

```js
'use strict';

const components = (robot, config) => ({
  robot,
  config,

  // scenario
  scenario: './scenario/common',
  task:     './scenario/task'
});

module.exports = components;
```


## cache method

メソッドのキャッシュ  

ディレクトリ構造  

```tree
scripts/app.js
src
├── scenario
│   ├── common
│   │   ├── index.js // *
│   │   ├── join-home.js
│   │   ├── select-action-admin.js
│   │   ├── select-receive.js
│   │   ├── stamp-receive.js
│   │   ├── text-action-admin.js
│   │   └── text-receive.js
```

`scenario/common/index.js`

```js
'use strict';

class Common {

  constructor(components) {
    components.mixin(this, __dirname, {
      joinHome:             './join-home',
      selectActionAdmin:    './select-action-admin',
      selectReceive:        './select-receive',
      stampReceive:         './stamp-receive',
      textActionAdmin:      './text-action-admin',
      textReceive:          './text-receive',
    });
  }

}

module.exports = Common;
```

クラス  

```js
'use strict';

class Schedules {

  constructor(spec) {
    this.spec = spec;
  }

  add(args) {
    return this.spec.apiSchedule.add(args);
  }
}

module.exports = Schedules;

```



メソッド  

`scenario/common/join-home.js`  

```js
'use strict';

const joinHome = ({ messages }) => {
  return ({ res }) => {

    return messages.joinUser({ res });
  };
};

module.exports = joinHome;
```

クラス、メソッド共にモジュールから読み込む方法でも可能

(再掲)  
```js
const spec = require('robot-spec').Spec();

spec.scenario.method();
```


クラス、メソッドのキャッシュ  

`scripts/app.js`  

## メソッドのディレクトリ設定

```js
new RobotSpec(robot).config(opts);
```

`opts`の設定を変更することで、各設置ディレクトリの変更が可能です。  


`opts`  

デフォルト  

```js
opts = {
  root: 'src/',
  config: 'src/config',
  components: 'src/components'
};
```

`config.js`は定数を定義し、グローバル利用できます。  
利用しない場合は、`false`を設定します。

```js
opts = {
  root: 'src/',
  config: false,
  components: 'src/components'
};
```

`config.js`を利用し、`components.js`(メソッドキャッシュ)を利用しない場合は、  
下記のように、`components`に`false`を設定します。  

```js
opts = {
  root: 'src/',
  config: 'src/config',
  components: false
};
```

または、`components`のみ設定します。


```js
opts = {
  components: false
};
```


グローバル定数

`src/config.js`  

```
const g = {};

g.ADMIN_USER = 'xxxxxxxx';
g.ADMIN_PASS = 'xxxxxxxx';

module.exports = g;
```
