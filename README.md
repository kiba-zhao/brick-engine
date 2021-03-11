# brick-engine #
应用的基础工具包．包含环境变量定义,加载配置文件,加载模块文件,以及模块模型化等应用常用基本功能．

使用依赖注入的方式,生成和管理模块对象．

## Install ##

``` shell
npm install --save brick-engine
```

## Usage ##
使用bin/brick-engine来启动应用和引擎.

### Configuration ###
brick-engine使用加载引导库来加载项目模块文件．引导设置文件详情,请参考[xboot](https://github.com/kiba-zhao/xboot)

> PS: brick-engine加载的默认设置文件问boot.js,而不是xboot默认使用的xboot.config.js

``` javascript
// {cwd}/boot.js
// {cwd}/node_modules/{xxx engine}/boot.js

exports.engine = 'brick-engine'
```

### StartUp ###

``` shell
npm install brick-engine
npx brick-engine
```

### App Entry ###
在brick-engine初始化时，将会加载调用默认的应用入口文件app.js．

``` javascript
// {cwd}/app.js
// {cwd}/node_modules/{xxx engine}/app.js  boot.js中设置的engine包
// {cwd}/node_modules/{xxx plugin}/app.js  plugin.js中设置的package包

// 简单示例
module.exports = (engine)=>{

}

// 简单使用engine中模块的示例
const {inject} = require('brick-engine');

module.exports = (moduleA,moduleB)=>{

    if(moduleB){
        ...
    }else{
        ...
    }
}

inject(module.exports,{deps:['moduleA','moduleB?']});
```

### Engine Config ###
brick-engine基本配置内容

``` javascript
// {cwd}/config/*.js
// {cwd}/node_modules/{xxx engine}/config/*.js  boot.js中设置的engine包
// {cwd}/node_modules/{xxx plugin}/config/*.js  plugin.js中设置的package包

exports.engine = {
    app:'app.js'  //应用入口文件匹配参数(BootLoader的patterns参数)
    modules:{     //模型化模块配置
        // 模型名称
        service: { 
            patterns: 'services/**/*.js',
            // 请参考xboot中BootLoader的opts参数说明
            opts:{}
        },
        model: { patterns: 'models/**/*.js' },
        helper: { patterns: 'helpers/**/*.js' }
    }
};
```

### Package Module ###
包模块定义内容.

**ENGINE**

brick-engine常量,在`engine.config`对应键值为brick-engine使用的配置信息．该信息定义了应用入口的文件名`app.js`,以及模块化文件的配置信息`modules:{}`.

> 其他插件,engine或app,可以通过exports[ENGINE]来设置brick-engine的配置信息.

#### Engine ####
brick-engine定义的引擎工具类

``` javascript
const {Engine} = require('brick-engine');

const engine = new Engine();
```

**env**

engine实例提供的环境变量对象,根据NODE_ENV设置默认BRICK_CONFIG环境变量.
  * 未设置BRICK_CONFIG,且NODE_ENV为production : BRICK_CONFIG为prod
  * 未设置BRICK_CONFIG,且NODE_ENV不production : BRICK_CONFIG为local
  
**config**

engine加载配置文件，根据env.BRICK_CONFIG合并后的配置内容对象.加载规则为：
  * `config/{env.BRICK_CONFIG}.js` > `config/default.js`
  * `{cwd}/config/*.js` > `{cwd}/{engine path}/config/*.js` > `{cwd}/{plugin path}/config/*.js`

**options**

构建engine实例的可选配置.

| Property | Example         | Description                                                                          |
|:---------|:----------------|:-------------------------------------------------------------------------------------|
| chdir    | "/home/xxx/app" | 应用执行目录,默认为`process.cwd()`                                                   |
| config   | "boot.js"       | 配置文件匹配规则,详细请参考: [globby](https://github.com/sindresorhus/globby#readme) |
| reverse  | false           | 逆序加载模块．值为`true`的查找加载顺序为: `engine` > `app` > `plugins`               |
| plugin   | true            | 是否加载插件加载．值为`false`则从plugin中加载模块                                    |
| mode     | "xboot"         | 只加载检索支持modes设置的模块                                                        |
| expand   | true            | 是否展开目录                                                                         |

##### engine.install(module[,silent=false]) #####
安装模块方法,将模块生成交由引擎控制．模块生成使用的依赖信息，以及在engine中的命名，通过使用[inject(module,opts)](#inject(module,opts))函数来定义．

**module**

`module`可以是`class`,`Function`或其他非`undefine`，非`null`的任意类型对象．

**silent**

成功定义模块，成员函数返回值为`true`,否则为`false`．试图安装未命名`module`,且`silent`参数不为`true`时,成员函数将直接抛出异常．

##### engine.use(module[, success, fatal]) #####
通过engine使用模块,可以声明使用依赖于`engine.install`安装的命名模块．与`engine.install`相同,通过使用[inject(module.opts)](#inject(module,opts))函数来定义．

**module**

`module`可以是`class`,`Function`或其他非`undefine`，非`null`的任意类型对象．不过允许使用未命名的`module`．

**success(results)**

成功构建模块的回调函数．回调参数为:

* `results.name`: 模块命名信息
* `results.module`: 模块构建函数
* `results.model`: 模块对象

**fatal(error)**

异常构建模块的回调函数．如果不提供该参数，将直接抛出异常.

##### engine.model(target[,success, fatal]) #####
模型化成员函数．将`engine.install`的模块，设置为特定模块对象的成员属性．通过[provide(module,opts)](#provide(module,opts))函数来定义．

**target**

模型化对象.

* `module`: 模块构造函数,或模块对象
* `name`: 模块命
* `model`: 模块实例对象

**success(results)**

成功构建模块的回调函数．回调参数为:

* `results.name`: 模块命名信息
* `results.module`: 模块构建函数
* `results.model`: 模块对象

**fatal(error)**

异常构建模块的回调函数．如果不提供该参数，将直接抛出异常.

##### engine.load(patterns[, opts = {}]) #####
文件模块加载方法.使用[xboot](https://github.com/kiba-zhao/xboot)的`BootLoader`加载文件模块.

**patterns**

文件匹配参数,支持`String`和`Array<String>`类型，详细请参考: [globby](https://github.com/sindresorhus/globby#readme)中`patterns`参数.

##### engine.build(patterns[, opts, success, fatal]) #####
文件模型构建方法．使用[xboot](https://github.com/kiba-zhao/xboot)的`BootLoader`加载文件模块，並使用`engine.model`將其模型化.


**patterns**

文件匹配参数,支持`String`和`Array<String>`类型，详细请参考: [globby](https://github.com/sindresorhus/globby#readme)中`patterns`参数.

**success(results)**

成功构建模块的回调函数．回调参数为:

* `results.name`: 模块命名信息
* `results.module`: 模块构建函数
* `results.model`: 模块对象

**fatal(error)**

异常构建模块的回调函数．如果不提供该参数，将直接抛出异常.

##### engine.init() #####
通过调用该方法初始化生成`engine.env`,`engine.config`.其他成员方法，也需要在初始化后才能使用．

#### inject(target, opts) ####
模块构建信息注入函数．不允许反复使用函数定义同一个模块构建对象．

**target**

模块构建对象.可以是`class`,`Function`或非`undefined`和非`null`对象.

**opts**

模块构建可选项.
  * opts.name:  模块命名.支持`String`和`Symbol`类型的值．
  * opts.deps:  构建时依赖的模块.支持`Array<String>`,`Array<Symbol>`,以及`Array<Object>`类型的值．
    * opts.deps[].id: 依赖模块的命名.支持`String`和`Symbol`类型的值．
    * opts.deps[].required: 依赖模块是否必要.

#### provide(target, opts) ####
定义成员属性使用的依赖模块信息．

**target**

模块的构建对象.可以是`class`,`Function`或非`undefined`和非`null`对象.

**opts**

模块构建可选项.
  * opts.property:  定义的成员属性名.支持`String`和`Symbol`类型的值．
  * opts.dep:  成员属性使用的依赖模块信息.支持`String`,`Symbol`,以及`Object`类型的值．
    * opts.dep.id: 依赖模块的命名.支持`String`和`Symbol`类型的值．
    * opts.dep.required: 依赖模块是否必要.
    * opts.dep.transform: 依赖模块转换函数.


#### Model Example ####
在模型相关的源码文件中，需要定义该文件模块依赖的上下文模块（比如各种db client模块,redis client模块以及http client模块等），以及该文件模块在模型中对应的属性名称.

``` javascript
// {cwd}/models/simple.js

const {inject,provide} = require('brick-engine');
 
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

// 定义生成类实例时候，作为构造参数使用的依赖模块
// 即同等于：　new SimpleModel(env,config);
inject(SimpleModel,{ deps:[ 'env', 'config?' ], name:'modelA'})
// 将依赖模块直接定义到类的实例中
// 即同等于：　const instance = new SimpleModel(...)
//           Object.defineProperty(instance,'cfg',{value:config,writable: false});
provide(SimpleModel, {property:'cfg', dep:'config?'});
```

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
