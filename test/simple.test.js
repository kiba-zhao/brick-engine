/**
 * @fileOverview 简单测试
 * @name simple.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const xboot = require('xboot');
const xprovide = require('xprovide');
const path = require('path');

const APP_PATH = path.join(__dirname, 'fixtures', 'apps', 'simple');
const DEFAULT_CONFIG = require('./fixtures/apps/simple/config/default');
const LOCAL_CONFIG = require('./fixtures/apps/simple/config/local');
// const PROD_CONFIG = require('./fixtures/apps/simple/config/prod');
// const CUSTOM_CONFIG = require('./fixtures/apps/simple/config/custom');

describe('simple', () => {

  let loader;
  let provider;
  const Provider = jest.fn();
  const context = {};

  beforeAll(() => {
    jest.doMock('xprovide', () => ({ Provider }), { virtual: true });
    jest.resetModules();
  });

  beforeEach(() => {
    Provider.mockImplementation((...args) => {
      provider = new xprovide.Provider(...args);
      return provider;
    });
    loader = xboot.createBootLoader('xboot.js', context, { chdir: APP_PATH });
  });

  afterEach(() => {
    Provider.mockReset();
  });


  afterAll(() => {
    jest.dontMock('xprovide');
  });

  it('boot local', () => {

    const envFn = jest.fn();
    const configFn = jest.fn();

    loader.forEach(_ => xboot.setup(_, xboot, context));

    provider.require([ 'env' ], envFn);
    provider.require([ 'config' ], configFn);

    expect(Provider).toBeCalledTimes(1);
    expect(Provider).toBeCalledWith();

    expect(envFn).toBeCalledTimes(1);
    const env = envFn.mock.calls[0][0];
    expect(env).toEqual({ ...process.env, XBLOCK_CONFIG: 'local' });

    expect(configFn).toBeCalledTimes(1);
    const config = configFn.mock.calls[0][0];
    expect(config).toEqual({
      ...DEFAULT_CONFIG, ...LOCAL_CONFIG, field: {
        ...DEFAULT_CONFIG.field, ...LOCAL_CONFIG.field,
        object: {
          ...DEFAULT_CONFIG.field.object, ...LOCAL_CONFIG.field.object,
        },
      },
    });

  });

});
