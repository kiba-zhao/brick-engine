/**
 * @fileOverview 注入插件
 * @name inject.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import { PACKAGE_NAME } from '../lib/constants';
import { Provider } from '../lib/provider';
import { MetadataManager } from '../lib/metadata_manager';

const METADATA = Symbol('METADATA');
const PROVIDER = Symbol('PROVIDER');

export const DI_SCOPE = Symbol('DI_SCOPE');
export const MODULE_KEY = `${PACKAGE_NAME}:InjectPlugin`;
const debug = Debug(MODULE_KEY);

export class InjectPlugin {

  /**
   * 依赖注入插件构造函数
   * @class
   * @param {MetadataManager} metadata 元数据管理器实例
   * @param {Provider} provider 提供器实例
 */
  constructor(metadata, provider) {

    debug('constructor %s', metadata, provider);

    assert(
      metadata instanceof MetadataManager,
      `[${MODULE_KEY}] constructor Error: wrong metadata`
    );
    assert(
      provider instanceof Provider,
      `[${MODULE_KEY}] constructor Error: wrong provider`
    );

    this[METADATA] = metadata;
    this[PROVIDER] = provider;
  }

  match(module) {
    const metadataManager = this[METADATA];
    const metadataQueue = metadataManager.extract(module, { scope: DI_SCOPE });
    return metadataQueue.length > 0;
  }

  async use(module) {
    const metadataManager = this[METADATA];
    const metadataQueue = metadataManager.extract(module, { scope: DI_SCOPE });

    const provider = this[PROVIDER];
    for (const metadata of metadataQueue) {
      provider.define(metadata.id, metadata.deps, module);
    }
  }

}
