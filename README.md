# brick-engine #
基于依赖注入模式([xprovide](https://github.com/kiba-zhao/xprovide))的基础工具engine．提供环境变量,配置文件内容以及功能模型注入插件．作为搭建应用的最基本engine使用．

## Install ##

``` shell
npm install --save brick-engine
```

## Usage ##
可以通过[xboot](https://github.com/kiba-zhao/xboot)加载使用项目.

### Configuration ###

``` javascript
// {cwd}/xboot.config.js
// {cwd}/node_modules/{xxx engine}/xboot.config.js

exports.engine = 'brick-engine'
```

### StartUp ###

``` shell
npm install xboot
npx xboot
```

## Plugins ##
  * [环境变量插件](#Env)
  * [配置插件](#Config)
  * [模型注入插件](#Inject)

### Env ###
将环境变量注入当前应用的[xprovide](https://github.com/kiba-zhao/xprovide)中．根据NODE_ENV设置默认XBLOCK_CONFIG环境变量.
  * 未设置XBLOCK_CONFIG,且NODE_ENV为production : XBLOCK_CONFIG为prod
  * 未设置XBLOCK_CONFIG,且NODE_ENV不production : XBLOCK_CONFIG为local

### Config ###
根据Env插件注入的XBLOCK_CONFIG,加载合并配置文件`config/{env.XBLOCK_CONFIG}.js`以及`config/default.js`．并将最终配置内容注入到当前应用的[xprovide](https://github.com/kiba-zhao/xprovide)中．

> `config/{env.XBLOCK_CONFIG}.js`将合并覆盖`config/default.js`中的内容．

### Inject ###
注入自定义匹配的功能模型到当前应用的[xprovide](https://github.com/kiba-zhao/xprovide)中．适用于定义业务逻辑模型对象(eggjs中的service)，数据模型对象(mvc中的model)，以及辅助功能模型对象(eggjs中的helper)等．

#### Inject Config ####
通过config定义需要注入的模型名称，以及模型相关文件的xboot引导加载参数．

``` javascript
// {cwd}/config/*.js
// {cwd}/node_modules/config/*.js

exports.inject = {
  // 注入名称
  controller: { 
    pattern: 'controllers/**/*.js',
    // 请参考xboot中BootLoader的opts参数说明
    opts:{}
  },
  service: { pattern: 'services/**/*.js' },
  model: { pattern: 'models/**/*.js' },
  helper: { pattern: 'helpers/**/*.js' },
};
```

#### Inject Describe ####
在模型相关的源码文件中，需要定义该文件模块依赖的上下文模块（比如各种db client模块,redis client模块以及http client模块等），以及该文件模块在模型中对应的属性名称.

``` javascript
// {cwd}/models/simple.js

/**
 * @inject modelA 模型中的属性名
 * @dependency env 依赖环境变量
 * @dependency config 依赖配置文件
 */
 
 class SimpleModel {
  constructor(env, config) {
    this._env = env;
    this._config = config;
  }

  get env() {
    return this._env;
  }

  getConfig() {
    return this._config;
  }

}

module.exports = SimpleModel;

```

**@inject** : 模型中的属性名
**@dependency** : 依赖的其他模块
**@dependency [xxx]** : 依赖的其他可选模块

## Documentations ##
使用`jsdoc`生成注释文档

``` shell
git clone https://github.com/kiba-zhao/brick-engine.git
cd brick-engine
npm install
npm run docs
open docs/index.html
```

## License ##
[MIT](LICENSE)
