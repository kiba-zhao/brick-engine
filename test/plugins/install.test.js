/**
 * @fileOverview 模块安装插件测试
 * @name install.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { jest } from '@jest/globals';
import { InstallPlugin, MODULE_KEY, MODULE_SCOPE } from '../../plugins/install';
import { Provider } from '../../lib/provider';
import { Engine } from '../../lib/engine';
import { inject } from '../../lib/metadata';

describe('plugins/install', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:InstallPlugin');
  });

  describe('InstallPlugin', () => {

    /**
     * @type Engine
     */
    let engine;
    /**
     * @type InstallPlugin
     */
    let plugin;

    beforeEach(() => {
      const provider = new Provider();
      engine = new Engine(provider);
      plugin = new InstallPlugin(engine);
    });

    describe('match', () => {

      it('success', async () => {

        const target = () => {};
        const metadata = Symbol('metadata');
        inject(target, metadata, { scope: MODULE_SCOPE });

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

      let engineInstallFn;

      beforeEach(() => {
        engineInstallFn = jest.spyOn(engine, 'install');
      });

      it('simple', async () => {
        const target = () => {};
        const metadata = Symbol('metadata');
        inject(target, metadata, { scope: MODULE_SCOPE });

        await plugin.use(target);

        expect(engineInstallFn).toBeCalledTimes(1);
        expect(engineInstallFn).toBeCalledWith(metadata);
      });

    });

  });

});
