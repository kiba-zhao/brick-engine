/**
 * @fileOverview 引擎测试代码
 * @name engine.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { jest } from '@jest/globals';
import { Engine, MODULE_KEY } from '../../lib/engine';
import { Provider } from '../../lib/provider';
import faker from 'faker';

describe('lib/engine', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:Engine');
  });

  describe('Engine', () => {

    it('simple', async () => {

      const provider = new Provider();
      const engine = new Engine(provider);

      const plugin = {
        match: jest.fn(),
        use: jest.fn(),
      };
      const Plugin = jest.fn(() => plugin);

      await engine.mount(Plugin);
      expect(Plugin).not.toBeCalled();

      const modules = [];
      for (let i = 0; i < 5; i++) {
        plugin.match.mockReturnValue(true);
        const module = () => {};
        modules.push(module);
        await engine.install(module);

        expect(Plugin).toBeCalledTimes(1);
        expect(Plugin).toBeCalledWith();
        expect(plugin.match).toBeCalledTimes(1);
        expect(plugin.match).toBeCalledWith(module);
        expect(plugin.use).toBeCalledTimes(1);
        expect(plugin.use).toBeCalledWith(module);

        plugin.match.mockReset();
        plugin.use.mockReset();
      }

      for (let i = 0; i < 5; i++) {
        plugin.match.mockReturnValue(false);
        const module = () => {};
        modules.push(module);
        await engine.install(module);

        expect(Plugin).toBeCalledTimes(1);
        expect(plugin.match).toBeCalledTimes(1);
        expect(plugin.match).toBeCalledWith(module);
        expect(plugin.use).not.toBeCalled();

        plugin.match.mockReset();
        plugin.use.mockReset();
      }

      // 挂载插件后

      const aplugin = {
        use: jest.fn(),
      };
      const aPlugin = jest.fn(() => aplugin);

      await engine.mount(aPlugin, { deps: [{ id: Plugin }] });

      expect(aPlugin).toBeCalledTimes(1);
      expect(aPlugin).toBeCalledWith(plugin);
      expect(aplugin.use).toBeCalledTimes(modules.length);
      expect(aplugin.use.mock.calls).toEqual(modules.map(_ => [ _ ]));
      aplugin.use.mockReset();

      for (let i = 0; i < 5; i++) {
        plugin.match.mockReturnValue(true);
        const module = () => {};
        await engine.install(module);

        expect(Plugin).toBeCalledTimes(1);
        expect(aPlugin).toBeCalledTimes(1);
        expect(plugin.match).toBeCalledTimes(1);
        expect(plugin.match).toBeCalledWith(module);
        expect(plugin.use).toBeCalledTimes(1);
        expect(plugin.use).toBeCalledWith(module);
        expect(aplugin.use).toBeCalledTimes(1);
        expect(aplugin.use).toBeCalledWith(module);

        plugin.match.mockReset();
        plugin.use.mockReset();
        aplugin.use.mockReset();
      }

      for (let i = 0; i < 5; i++) {
        plugin.match.mockReturnValue(false);
        const module = () => {};
        modules.push(module);
        await engine.install(module);

        expect(Plugin).toBeCalledTimes(1);
        expect(aPlugin).toBeCalledTimes(1);
        expect(plugin.match).toBeCalledTimes(1);
        expect(plugin.match).toBeCalledWith(module);
        expect(plugin.use).not.toBeCalled();
        expect(aplugin.use).toBeCalledTimes(1);
        expect(aplugin.use).toBeCalledWith(module);

        plugin.match.mockReset();
        plugin.use.mockReset();
        aplugin.use.mockReset();
      }

    });

    class ModelClass {

    }

    it('constructor errror', async () => {
      const WRONG_PROVIDER =
            `[${MODULE_KEY}] constructor Error: wrong provider`;

      expect(() => new Engine()).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(faker.datatype.array())).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(faker.datatype.boolean())).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(faker.datatype.number())).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(faker.datatype.datetime())).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(faker.datatype.string())).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(ModelClass)).toThrow(WRONG_PROVIDER);
      expect(() => new Engine({})).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(null)).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(undefined)).toThrow(WRONG_PROVIDER);
      expect(() => new Engine(Symbol())).toThrow(WRONG_PROVIDER);

    });

  });

});
