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
const PROD_CONFIG = require('./fixtures/apps/simple/config/prod');
const CUSTOM_CONFIG_FUN = require('./fixtures/apps/simple/config/custom');
const INJECT_CONFIG = require('./fixtures/apps/simple/config/inject');
const MODEL_A_CLASS = require('./fixtures/apps/simple/moduleA/model_a');
const MODEL_B = require('./fixtures/apps/simple/moduleA/dir_a/model_b');

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

  it('boot prod', () => {
    const envFn = jest.fn();
    const configFn = jest.fn();

    const NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    loader.forEach(_ => xboot.setup(_, xboot, context));

    provider.require([ 'env' ], envFn);
    provider.require([ 'config' ], configFn);

    expect(Provider).toBeCalledTimes(1);
    expect(Provider).toBeCalledWith();

    expect(envFn).toBeCalledTimes(1);
    const env = envFn.mock.calls[0][0];
    expect(env).toEqual({ ...process.env, XBLOCK_CONFIG: 'prod' });

    expect(configFn).toBeCalledTimes(1);
    const config = configFn.mock.calls[0][0];
    expect(config).toEqual({
      ...DEFAULT_CONFIG, ...PROD_CONFIG, field: {
        ...DEFAULT_CONFIG.field, ...PROD_CONFIG.field,
        object: {
          ...DEFAULT_CONFIG.field.object, ...PROD_CONFIG.field.object,
        },
      },
    });

    process.env.NODE_ENV = NODE_ENV;
  });

  it('boot custom', () => {
    const envFn = jest.fn();
    const configFn = jest.fn();

    const XBLOCK_CONFIG = process.env.XBLOCK_CONFIG;
    process.env.XBLOCK_CONFIG = 'custom';

    loader.forEach(_ => xboot.setup(_, xboot, context));

    provider.require([ 'env' ], envFn);
    provider.require([ 'config' ], configFn);

    expect(Provider).toBeCalledTimes(1);
    expect(Provider).toBeCalledWith();

    expect(envFn).toBeCalledTimes(1);
    const env = envFn.mock.calls[0][0];
    expect(env).toEqual({ ...process.env, XBLOCK_CONFIG: 'custom' });

    expect(configFn).toBeCalledTimes(1);
    const config = configFn.mock.calls[0][0];
    const CUSTOM_CONFIG = CUSTOM_CONFIG_FUN(env);
    expect(config).toEqual({
      ...DEFAULT_CONFIG, ...CUSTOM_CONFIG, field: {
        ...DEFAULT_CONFIG.field, ...CUSTOM_CONFIG.field,
        object: {
          ...DEFAULT_CONFIG.field.object, ...CUSTOM_CONFIG.field.object,
        },
      },
    });

    process.env.XBLOCK_CONFIG = XBLOCK_CONFIG;

  });

  it('boot config not found', () => {
    const envFn = jest.fn();
    const configFn = jest.fn();

    const XBLOCK_CONFIG = process.env.XBLOCK_CONFIG;
    process.env.XBLOCK_CONFIG = 'not_found';

    loader.forEach(_ => xboot.setup(_, xboot, context));

    provider.require([ 'env' ], envFn);
    provider.require([ 'config' ], configFn);

    expect(Provider).toBeCalledTimes(1);
    expect(Provider).toBeCalledWith();

    expect(envFn).toBeCalledTimes(1);
    const env = envFn.mock.calls[0][0];
    expect(env).toEqual({ ...process.env, XBLOCK_CONFIG: 'not_found' });

    expect(configFn).toBeCalledTimes(1);
    const config = configFn.mock.calls[0][0];
    expect(config).toEqual(DEFAULT_CONFIG);

    process.env.XBLOCK_CONFIG = XBLOCK_CONFIG;

  });

  it('boot inject', () => {
    const envFn = jest.fn();
    const configFn = jest.fn();
    const moduleAFn = jest.fn();
    const moduleBFn = jest.fn();

    const XBLOCK_CONFIG = process.env.XBLOCK_CONFIG;
    process.env.XBLOCK_CONFIG = 'inject';

    loader.forEach(_ => xboot.setup(_, xboot, context));

    provider.require([ 'env' ], envFn);
    provider.require([ 'config' ], configFn);
    provider.require([ 'moduleA' ], moduleAFn);
    provider.require([ 'moduleB' ], moduleBFn);

    expect(Provider).toBeCalledTimes(1);
    expect(Provider).toBeCalledWith();

    expect(envFn).toBeCalledTimes(1);
    const env = envFn.mock.calls[0][0];
    expect(env).toEqual({ ...process.env, XBLOCK_CONFIG: 'inject' });

    expect(configFn).toBeCalledTimes(1);
    const config = configFn.mock.calls[0][0];
    expect(config).toEqual({ ...DEFAULT_CONFIG, ...INJECT_CONFIG });

    process.env.XBLOCK_CONFIG = XBLOCK_CONFIG;

    expect(moduleAFn).toBeCalledTimes(1);
    const moduleA = moduleAFn.mock.calls[0][0];
    const moduleAKeys = Object.keys(moduleA);
    expect(moduleAKeys).toEqual([ 'modelA', 'modelB', 'modelC' ]);
    // expect(moduleA.modelA).toBeInstanceOf(MODEL_A_CLASS);
    expect(moduleA.modelA.constructor.name).toBe(MODEL_A_CLASS.name);
    expect(moduleA.modelA.env).toEqual(env);
    expect(moduleA.modelA.getConfig()).toEqual(config);
    expect(moduleA.modelB).toEqual(MODEL_B);
    expect(moduleA.modelC.env).toEqual(env);
    expect(moduleA.modelC.getConfig()).toEqual(config);

    expect(moduleBFn).toBeCalledTimes(1);
    const moduleB = moduleBFn.mock.calls[0][0];
    expect(moduleB).toEqual({});
  });
});
