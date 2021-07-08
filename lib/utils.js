/**
 * @fileOverview 工具函数
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import { PACKAGE_NAME } from './constants.js';
import { Provider } from './provider.js';
import { Engine } from './engine.js';
import { InstallPlugin, MountPlugin, InjectPlugin } from '../plugins/index.js';

export const MODULE_KEY = `${PACKAGE_NAME}:utils`;
const debug = Debug(MODULE_KEY);

/**
 *创建基本引擎工具函数
 * @param {Provider} 提供器实例
 * @return {Engine} 构建的引擎实例
 */
export async function createEngine(provider = new Provider()) {

  debug('createEngine');

  provider.define(Provider, [], () => provider);
  provider.define(Engine, [{ id: Provider }], Engine);

  /** @type Engine[] **/
  const [ engine ] = await provider.require({ id: Engine });
  await engine.mount(InstallPlugin, { deps: [{ id: Engine }] });
  await engine.mount(MountPlugin, { deps: [{ id: Engine }] });
  await engine.mount(InjectPlugin, { deps: [{ id: Provider }] });

  return engine;
}

