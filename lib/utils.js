/**
 * @fileOverview 工具函数
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
// import assert from 'assert';
import { PACKAGE_NAME } from './constants';
import { Provider } from './provider';
import { MetadataManager } from './metadata_manager';
import { Engine } from './engine';
import { InstallPlugin, MountPlugin, InjectPlugin } from '../plugins';

export const MODULE_KEY = `${PACKAGE_NAME}:utils`;
const debug = Debug(MODULE_KEY);


export async function createEngine() {

  debug('createEngine');

  const provider = new Provider();
  provider.define(Provider, [], () => provider);
  provider.define(Engine, [{ id: Provider }], Engine);
  provider.define(MetadataManager, [], MetadataManager);

  const engine = await provider.require({ id: Provider });
  await engine.mount(InstallPlugin, [{ id: MetadataManager }, { id: Engine }]);
  await engine.mount(MountPlugin, [{ id: MetadataManager }, { id: Engine }]);
  await engine.mount(InjectPlugin, [{ id: MetadataManager }, { id: Provider }]);

  return engine;
}

