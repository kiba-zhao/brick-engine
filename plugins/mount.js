/**
 * @fileOverview 插件装载处理插件
 * @name mount.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import { PACKAGE_NAME } from './constants';
import { Engine } from '../lib/engine';
import { MetadataManager } from '../lib/metadata_manager';

const METADATA = Symbol('METADATA');
const ENGINE = Symbol('ENGINE');

export const PLUGIN_SCOPE = Symbol('PLUGIN_SCOPE');
export const MODULE_KEY = `${PACKAGE_NAME}:MountPlugin`;
const debug = Debug(MODULE_KEY);

export class MountPlugin {

  /**
   * 插件装载处理插件构造函数
   * @class
   * @param {MetadataManager} metadata 元数据管理器实例
   * @param {Engine} engine 引擎实例
   */
  constructor(metadata, engine) {

    debug('constructor %s', metadata, engine);

    assert(
      metadata instanceof MetadataManager,
      `[${MODULE_KEY}] constructor Error: wrong metadata`
    );
    assert(
      engine instanceof Engine,
      `[${MODULE_KEY}] constructor Error: wrong engine`
    );

    this[METADATA] = metadata;
    this[ENGINE] = engine;
  }

  match(module) {
    const metadataManager = this[METADATA];
    const metadataQueue = metadataManager.extract(module, { scope: PLUGIN_SCOPE });
    return metadataQueue.length > 0;
  }

  async use(module) {
    const metadataManager = this[METADATA];
    const metadataQueue = metadataManager.extract(module, { scope: PLUGIN_SCOPE });

    const engine = this[ENGINE];
    for (const metadata of metadataQueue) {
      await engine.install(metadata.plugin, metadata.opts);
    }

  }


}
