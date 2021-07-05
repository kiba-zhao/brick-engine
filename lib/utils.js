/**
 * @fileOverview 工具函数
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import { PACKAGE_NAME } from './constants';
import { Provider } from './provider';
import { Engine } from './engine';
import { InstallPlugin, MountPlugin, InjectPlugin } from '../plugins';

export const MODULE_KEY = `${PACKAGE_NAME}:utils`;
const debug = Debug(MODULE_KEY);

/**
 *创建基本引擎工具函数
 * @return {Engine} 构建的引擎实例
 */
export async function createEngine() {

  debug('createEngine');

  const provider = new Provider();
  provider.define(Provider, [], () => provider);
  provider.define(Engine, [{ id: Provider }], Engine);

  const engine = await provider.require({ id: Provider });
  await engine.mount(InstallPlugin, [{ id: Engine }]);
  await engine.mount(MountPlugin, [{ id: Engine }]);
  await engine.mount(InjectPlugin, [{ id: Provider }]);

  return engine;
}

