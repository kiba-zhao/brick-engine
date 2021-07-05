/**
 * @fileOverview 注入插件测试
 * @name inject.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { jest } from '@jest/globals';
import { InjectPlugin, MODULE_KEY, DI_SCOPE } from '../../plugins/inject';
import { Provider } from '../../lib/provider';
import { inject } from '../../lib/metadata';

describe('plugins/inject', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:InjectPlugin');
  });

  describe('InjectPlugin', () => {

    /**
     * @type Provider
     */
    let provider;
    /**
     * @type InjectPlugin
     */
    let plugin;

    beforeEach(() => {
      provider = new Provider();
      plugin = new InjectPlugin(provider);
    });

    describe('match', () => {

      it('success', async () => {

        const target = () => {};
        const metadata = Symbol('metadata');
        inject(target, metadata, { scope: DI_SCOPE });

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

      let providerDefineFn;

      beforeEach(() => {
        providerDefineFn = jest.spyOn(provider, 'define');
      });

      it('simple', async () => {

        const target = () => {};
        const id = Symbol('id');
        const deps = [{ id: Symbol('depID') }];
        inject(target, { id, deps }, { scope: DI_SCOPE });

        await plugin.use(target);

        expect(providerDefineFn).toBeCalledTimes(1);
        expect(providerDefineFn).toBeCalledWith(id, deps, target);

      });

    });

  });

});
