/**
 * @fileOverview 工具方法测试
 * @name utils.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { jest } from '@jest/globals';
import { MODULE_KEY } from '../../lib/utils';
import { createEngine, Provider, Engine } from '../../lib';
import { InstallPlugin, MountPlugin, InjectPlugin } from '../../plugins';

describe('lib/utils', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:utils');
  });

  describe('createEngine', () => {

    it('simple', async () => {

      const provider = new Provider();
      const defineSpy = jest.spyOn(provider, 'define');

      const engine = await createEngine(provider);
      const [ pEngine ] = await provider.require({ id: Engine });

      expect(engine).toBe(pEngine);
      expect(defineSpy).toBeCalledTimes(5);
      expect(defineSpy.mock.calls[0]).toEqual([ Provider, [], expect.anything() ]);
      expect(defineSpy.mock.calls[0][2]()).toBe(provider);
      expect(defineSpy.mock.calls[1]).toEqual([ Engine, [{ id: Provider }], Engine ]);
      expect(defineSpy.mock.calls[2]).toEqual([ InstallPlugin, [{ id: Engine }], InstallPlugin ]);
      expect(defineSpy.mock.calls[3]).toEqual([ MountPlugin, [{ id: Engine }], MountPlugin ]);
      expect(defineSpy.mock.calls[4]).toEqual([ InjectPlugin, [{ id: Provider }], InjectPlugin ]);


    });

  });

});
