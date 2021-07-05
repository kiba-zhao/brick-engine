/**
 * @fileOverview 插件转载插件测试
 * @name mount.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { jest } from '@jest/globals';
import { MountPlugin, MODULE_KEY, PLUGIN_SCOPE } from '../../plugins/mount';
import { Provider } from '../../lib/provider';
import { Engine } from '../../lib/engine';
import { inject } from '../../lib/metadata';

describe('plugins/mount', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:MountPlugin');
  });

  describe('MountPlugin', () => {

    /**
     * @type Engine
     */
    let engine;
    /**
     * @type MountPlugin
     */
    let plugin;

    beforeEach(() => {
      const provider = new Provider();
      engine = new Engine(provider);
      plugin = new MountPlugin(engine);
    });

    describe('match', () => {

      it('success', async () => {

        const target = () => {};
        const metadata = Symbol('metadata');
        inject(target, metadata, { scope: PLUGIN_SCOPE });

        const res = plugin.match(target);
        expect(res).toBeTruthy();

      });

      it('failed', async () => {

        const target = () => {};
        const metadata = Symbol('metadata');
        inject(target, metadata, { scope: Symbol() });

        const res = plugin.match(target);
        expect(res).toBeFalsy();

      });

      it('failed with empty', async () => {

        const target = () => {};

        const res = plugin.match(target);
        expect(res).toBeFalsy();

      });

    });

    describe('use', () => {

      let engineMountFn;

      beforeEach(() => {
        engineMountFn = jest.spyOn(engine, 'mount');
      });

      it('simple', async () => {
        const target = () => {};
        const metadata = Symbol('metadata');
        inject(target, metadata, { scope: PLUGIN_SCOPE });

        await plugin.use(target);

        expect(engineMountFn).toBeCalledTimes(1);
        expect(engineMountFn).toBeCalledWith(target, metadata);
      });

    });

  });

});
