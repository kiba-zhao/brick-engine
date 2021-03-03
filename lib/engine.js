/**
 * @fileOverview 引擎功能类
 * @name engine.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { assign, isFunction, noop } = require('lodash');
const { BootLoader } = require('xboot');

const { ENGINE } = require('./constants');
const { createEnv } = require('./env');
const { createConfig } = require('./config');
const Provider = require('./provider');
const { getInjectInfo, getProvideInfo } = require('./inject');
const { buildModel, initModel } = require('./model');
const ModuleFactory = require('./module_factory');

const ENV = Symbol('env');
const OPTIONS = Symbol('options');
const CONFIG = Symbol('config');
const PROVIDER = Symbol('provider');

class Engine {
  /**
   * 引擎构造函数
   * @param {Object} opts BootLoader可选参数
   */
  constructor(opts = {}) {
    this[OPTIONS] = assign({ config: 'boot.js', context: {} }, opts);
  }

  /**
   * 构造可选参数
   * @return {Object}
   */
  get options() {
    return this[OPTIONS];
  }

  /**
   * 环境变量
   * @return {Object}
   */
  get env() {
    return this[ENV];
  }

  /**
   * 配置文件内容
   * @return {Object}
   */
  get config() {
    return this[CONFIG];
  }

  /**
   * 安装模块方法,将模块生成交由引擎控制
   * @param {any} module 模块的构建方法
   * @param {Boolean} silent 静默处理:设置忽略未命名模块
   * @return {Boolean} 返回安装结果
   */
  install(module, silent = false) {
    assert(module !== undefined && module !== null, '[brick-engine Engine] install Error: wrong module');

    const provider = this[PROVIDER];
    assert(provider, '[brick-engine Engine] install Error: never init');

    const { name, deps } = getInjectInfo(module);
    if (silent && !name) {
      return false;
    }
    provider.define(name, deps, (...modules) => buildModel(module, deps, ...modules));
    return true;
  }

  /**
   * 模型化目标
   * @typedef {Object} Target
   * @property {any} module 模块构造函数,或模块对象(包含inject函数定义的对象)
   * @property {String} name 模块命名
   * @property {any} model 模块实例对象
   */

  /**
   * 使用引擎管理的模块
   * @param {any} module 模块的构建方法
   * @param {Function} success 成功回调函数
   * @param {Function} fatal 失败回调函数
   * @throws {Error} 获取模块中抛出的异常
   */
  use(module, success, fatal) {
    assert(module !== undefined && module !== null, '[brick-engine Engine] use Error: wrong module');
    assert(isFunction(success) || success === undefined, '[brick-engine Engine] use Error: wrong success');
    assert(isFunction(fatal) || fatal === undefined, '[brick-engine Engine] use Error: wrong fatal');

    const provider = this[PROVIDER];
    assert(provider, '[brick-engine Engine] use Error: never init');

    const { name, deps } = getInjectInfo(module);
    if (deps.length > 0) {
      let fn;
      if (success) {
        fn = (...modules) => success({ name, module, model: buildModel(module, deps, ...modules) });
      } else {
        fn = (...modules) => buildModel(module, deps, ...modules);
      }
      provider.require(deps, fn, fatal);
    } else {
      try {
        const model = buildModel(module, [], this);
        if (success) {
          success({ name, module, model });
        }
      } catch (err) {
        if (fatal) {
          fatal(err);
        } else {
          throw err;
        }
      }

    }
  }

  /**
   * 模型化方法：根据provide函数设置的信息,给引擎生成的模块定义成员属性
   * @param {Target} target 模型化目标
   * @param {Function} success 成功回调函数
   * @param {Function} fatal 失败回调函数
   */
  model(target, success, fatal) {
    assert(target !== undefined && target !== null, '[brick-engine Engine] model Error: wrong target');
    assert(target.module !== undefined && target.module !== null, '[brick-engine Engine] target.module Error: wrong module');
    assert(target.model !== undefined && target.model !== null, '[brick-engine Engine] target.model Error: wrong target.model');
    assert(isFunction(success) || success === undefined, '[brick-engine Engine] initModel Error: wrong success argument');
    assert(isFunction(fatal) || fatal === undefined, '[brick-engine Engine] initModel Error: wrong fatal argument');

    const provider = this[PROVIDER];
    assert(provider, '[brick-engine Engine] model Error: never init');

    const { deps, properties } = getProvideInfo(target.module);
    if (deps.length <= 0) {
      success(target);
      return;
    }

    let fn;
    if (success) {
      fn = (...modules) => success(initModel(target, properties, deps, modules));
    } else {
      fn = (...modules) => initModel(target, properties, deps, modules);
    }
    provider.require(deps, fn, fatal);

  }

  /**
   * 加载文件模块方法
   * @param {String | Array<String>} patterns 匹配文件规则
   * @param {Object} opts BootLoader可选参数
   * @return {Array<any>} 匹配的文件模块
   */
  load(patterns, opts = {}) {
    const options = assign(opts, this[OPTIONS]);
    const modules = new BootLoader(patterns, options);
    return modules;
  }

  /**
   * 模块构建方法：加载文件模块后,将其模型化
   * @param {String | Array<String>} patterns 匹配文件规则
   * @param {Object} opts BootLoader可选参数
   * @param {Function} success 成功回调函数
   * @param {Function} fatal 失败回调函数
   * @return {}
   */
  build(patterns, opts, success, fatal) {

    assert(success === undefined || isFunction(success), '[brick-engine Engine] create Error: wrong success argument');
    assert(fatal === undefined || isFunction(fatal), '[brick-engine ModelFactory] create Error: wrong fatal argument');
    assert(this[PROVIDER], '[brick-engine Engine] build Error: never init');

    const { model, ...options } = opts || {};
    const modules = this.load(patterns, options);
    const factory = new ModuleFactory(this, modules, model === undefined ? true : model);
    if (success) {
      factory.create(success, fatal);
    }
    return factory;
  }

  /**
   * 初始化引擎方法
   */
  init() {
    this[PROVIDER] = new Provider();
    const env = this[ENV] = createEnv();
    const configModules = this.load([ `config/${env.BRICK_CONFIG}.js`, 'config/default.js' ]);
    const config = this[CONFIG] = createConfig(configModules, env.BRICK_CONFIG, env);
    const engineConfig = config[ENGINE];
    this.build(engineConfig.app, assign({ model: false }, engineConfig.opts), noop);
  }

}

module.exports = Engine;
