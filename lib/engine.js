/**
 * @fileOverview 引擎功能类
 * @name engine.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import { PACKAGE_NAME } from './constants';
import { Provider } from './provider';

const ENGINE_MODULES = Symbol('ENGINE_MODULES');
const ENGINE_PLUGINS = Symbol('ENGINE_PLUGINS');
const ENGINE_PROVIDER = Symbol('ENGINE_PROVIDER');

export const MODULE_KEY = `${PACKAGE_NAME}:Engine`;
const debug = Debug(MODULE_KEY);

/**
 * 引擎插件构建器
 * @typedef {any} EnginePlugin
 */

/**
 * 引擎模块
 * @typedef {any} EngineModule
 */

export class Engine {

  /**
   * @private
   * @readonly
   * @type {EngineModule[]}
   */
  [ENGINE_MODULES] = [];

  /**
   * @private
   * @readonly
   * @type {EnginePlugin[]}
   */
  [ENGINE_PLUGINS] = [];

  /**
   * 引擎构造函数
   * @class
   * @param {Provider} provider 提供器实例
   */
  constructor(provider) {

    debug('constructor %s', provider);

    assert(
      provider instanceof Provider,
      `[${MODULE_KEY}] constructor Error: wrong provider`
    );

    this[ENGINE_PROVIDER] = provider;

  }

  /**
   * 引擎可选项
   * @typedef {Object} EngineMountOpts
   * @property {import("./provider").ProviderDependency[]} [deps] 依赖项列表
   */

  /**
   *挂载插件
   * @param {EnginePlugin} Plugin 插件构建器
   * @param {EngineMountOpts} opts 挂载可选项
   */
  async mount(Plugin, opts = {}) {

    debug('mount %s %s', Plugin, JSON.stringify(opts));

    const provider = this[ENGINE_PROVIDER];
    const pluginQueue = this[ENGINE_PLUGINS];

    provider.define(Plugin, opts.deps || [], Plugin);
    pluginQueue.push(Plugin);

    const modules = this[ENGINE_MODULES];
    if (modules.length <= 0) {
      return;
    }

    const promises = [];
    for (const m of modules) {
      promises.push(setup(this[ENGINE_PROVIDER], m, Plugin));
    }
    await Promise.all(promises);

  }

  /**
   *安装模块
   * @param {EngineModule} module 需要安装的模块
   */
  async install(module) {

    debug('install %s', module);

    const moduleQueue = this[ENGINE_MODULES];
    moduleQueue.push(module);

    const promises = [];
    for (const Plugin of this[ENGINE_PLUGINS]) {
      promises.push(setup(this[ENGINE_PROVIDER], module, Plugin));
    }
    await Promise.all(promises);

  }

}

/**
 * 插件安装匹配的模块
 * @param {Provider} provider 模块提供器
 * @param {any} module 模块
 * @param {any} Plugin 插件构建器
 */
async function setup(provider, module, Plugin) {

  debug('setup %s %s', module, Plugin);

  const [ plugin ] = await provider.require({ id: Plugin });
  if (!plugin.match || plugin.match(module)) {
    await plugin.use(module);
  }

}
