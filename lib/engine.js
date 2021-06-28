/**
 * @fileOverview 引擎功能类
 * @name engine.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import lodash from 'lodash';
import { PACKAGE_NAME } from './constants';
import { MetadataManager } from './metadata_manager';
import { Provider } from './provider';

const ENGINE_PROVIDER = Symbol('ENGINE_PROVIDER');
const ENGINE_METADATA = Symbol('ENGINE_METADATA');

export const MODULE_KEY = `${PACKAGE_NAME}:Engine`;
const debug = Debug(MODULE_KEY);
const { isUndefined, isObject } = lodash;

/**
 * 引擎可选项
 * @typedef {Object} EngineOpts
 * @property {Provider} [provider] 提供器对象
 * @property {MetadataManager} [metadata] 元数据管理器对象
 */

export class Engine {

  /**
   * 提供器构造函数
   * @class
   * @param {EngineOpts} [opts] 引擎可选项
   */
  constructor(opts = {}) {

    debug('new with %s', JSON.stringify(opts));

    assert(
      !isUndefined(opts) && isObject(opts),
      `[${MODULE_KEY}] constructor Error: wrong opts`
    );
    assert(
      isUndefined(opts.metadata) || opts.metadata instanceof MetadataManager,
      `[${MODULE_KEY}] constructor Error: wrong opts.metadata`
    );
    assert(
      isUndefined(opts.provider) || opts.provider instanceof Provider,
      `[${MODULE_KEY}] constructor Error: wrong opts.provider`
    );

    this[ENGINE_METADATA] = opts.metadata || new MetadataManager();
    this[ENGINE_PROVIDER] = opts.provider || new Provider();

  }

}
