/**
 * @fileOverview 插件装载处理插件
 * @name mount.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import { PACKAGE_NAME } from '../lib/constants.js';
import { Engine } from '../lib/engine.js';
import { extract } from '../lib/metadata.js';

const ENGINE = Symbol('ENGINE');

export const PLUGIN_SCOPE = Symbol('PLUGIN_SCOPE');
export const MODULE_KEY = `${PACKAGE_NAME}:MountPlugin`;
const debug = Debug(MODULE_KEY);

export class MountPlugin {

  /**
   * 插件装载处理插件构造函数
   * @class
   * @param {Engine} engine 引擎实例
   */
  constructor(engine) {

    debug('constructor %s', engine);

    assert(
      engine instanceof Engine,
      `[${MODULE_KEY}] constructor Error: wrong engine`
    );

    this[ENGINE] = engine;
  }

  /**
   *检查是否为匹配插件模块
   * @param {import("../lib/engine").EngineModule} module 检查的模块
   * @return {boolean} true:匹配/false:
   */
  match(module) {
    const metadataQueue = extract(module, { scope: PLUGIN_SCOPE });
    return metadataQueue.length > 0;
  }

  /**
   *使用插件方法
   * @param {import("../lib/engine").EnginePlugin} module 使用的插件模块
   */
  async use(module) {
    const metadataQueue = extract(module, { scope: PLUGIN_SCOPE });

    const engine = this[ENGINE];
    for (const metadata of metadataQueue) {
      await engine.mount(module, metadata);
    }

  }


}
