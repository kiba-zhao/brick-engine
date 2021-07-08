/**
 * @fileOverview 注入插件
 * @name inject.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import { PACKAGE_NAME } from '../lib/constants.js';
import { Provider } from '../lib/provider.js';
import { extract } from '../lib/metadata.js';

const PROVIDER = Symbol('PROVIDER');

export const DI_SCOPE = Symbol('DI_SCOPE');
export const MODULE_KEY = `${PACKAGE_NAME}:InjectPlugin`;
const debug = Debug(MODULE_KEY);

export class InjectPlugin {

  /**
   * 依赖注入插件构造函数
   * @class
   * @param {Provider} provider 提供器实例
 */
  constructor(provider) {

    debug('constructor %s', provider);

    assert(
      provider instanceof Provider,
      `[${MODULE_KEY}] constructor Error: wrong provider`
    );

    this[PROVIDER] = provider;
  }

  match(module) {
    const metadataQueue = extract(module, { scope: DI_SCOPE });
    return metadataQueue.length > 0;
  }

  async use(module) {
    const metadataQueue = extract(module, { scope: DI_SCOPE });

    const provider = this[PROVIDER];
    for (const metadata of metadataQueue) {
      provider.define(metadata.id, metadata.deps, module);
    }
  }

}
