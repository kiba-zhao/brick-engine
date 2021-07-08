/**
 * @fileOverview 模块安装插件
 * @name install.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import { PACKAGE_NAME } from '../lib/constants.js';
import { Engine } from '../lib/engine.js';
import { extract } from '../lib/metadata.js';

const ENGINE = Symbol('ENGINE');

export const MODULE_SCOPE = Symbol('MODULE_SCOPE');
export const MODULE_KEY = `${PACKAGE_NAME}:InstallPlugin`;
const debug = Debug(MODULE_KEY);

export class InstallPlugin {

  /**
   * 模块安装插件构造函数
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
   *检查是否为匹配模块
   * @param {import("../lib/engine").EngineModule} module 检查的模块
   * @return {boolean} true:匹配/false:不匹配
   */
  match(module) {
    const metadataQueue = extract(module, { scope: MODULE_SCOPE });
    return metadataQueue.length > 0;
  }

  /**
   *使用模块方法
   * @param {import("../lib/engine").EngineModule} module 使用的模块
   */
  async use(module) {
    const metadataQueue = extract(module, { scope: MODULE_SCOPE });

    const engine = this[ENGINE];
    for (const metadata of metadataQueue) {
      await engine.install(metadata);
    }
  }

}
