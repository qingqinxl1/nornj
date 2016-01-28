# NornJ
一款轻量级且多用途的javascript模板引擎

这款js模板引擎的构建方式不是使用传统的字符串，而是使用javascript原生的数组与对象构成，就像这样：
```js
var tmpl =
['div',
    'this the test demo {msg}.',
    ['<input onclick={click} />', { id: 'test' }],
'/div'];
```

* 它可以作为Backbone.js等传统MVC框架的模板引擎，职责是接受数据输出html字符串;
* 它也可以支持React.js，作为JSX的替代模板语言，并可以使React.js运行在无需编译转换的浏览器环境中;
* 由于它可以输出html字符串，所以也可以作为node.js服务器框架Express.js的模板语言。

## 这是 H2



## Installation

## Usage

```js
ffffff
```
