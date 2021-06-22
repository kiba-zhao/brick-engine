/**
 * @fileOverview 简单测试
 * @name simple.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


const path = require('path');
const { Engine, inject } = require('..');

const APP_PATH = path.join(__dirname, 'fixtures', 'apps', 'simple');
const ENGINE_CONFIG = require('../config/default');
const DEFAULT_CONFIG = require('./fixtures/apps/simple/config/default');
const LOCAL_CONFIG = require('./fixtures/apps/simple/config/local');
const PROD_CONFIG = require('./fixtures/apps/simple/config/prod');
const CUSTOM_CONFIG_FUN = require('./fixtures/apps/simple/config/custom');
const MODULES_CONFIG = require('./fixtures/apps/simple/config/modules');
const MODEL_A_CLASS = require('./fixtures/apps/simple/moduleA/model_a');
const MODEL_B = require('./fixtures/apps/simple/moduleA/dir_a/model_b');

describe('simple', () => {

  let engine;
  let NODE_ENV;
  let BRICK_CONFIG;

  beforeAll(() => {
    engine = new Engine({ chdir: APP_PATH });
  });

  beforeEach(() => {
    NODE_ENV = process.env.NODE_ENV;
    BRICK_CONFIG = process.env.BRICK_CONFIG;
  });

  afterEach(() => {
    if (NODE_ENV) {
      process.env.NODE_ENV = NODE_ENV;
    } else {
      delete process.env.NODE_ENV;
    }
    if (BRICK_CONFIG) {
      process.env.BRICK_CONFIG = BRICK_CONFIG;
    } else {
      delete process.env.BRICK_CONFIG;
    }

  });

  afterAll(() => {
    engine = undefined;
  });

  it('local environment', () => {

    engine.init();
    expect(engine.env).toEqual({ ...process.env, BRICK_CONFIG: 'local' });
    expect(engine.config).toEqual({
      ...ENGINE_CONFIG, ...DEFAULT_CONFIG, ...LOCAL_CONFIG, field: {
        ...DEFAULT_CONFIG.field, ...LOCAL_CONFIG.field,
        object: {
          ...DEFAULT_CONFIG.field.object, ...LOCAL_CONFIG.field.object,
        },
      },
    });

  });

  it('prod environment', () => {

    process.env.NODE_ENV = 'production';

    engine.init();
    expect(engine.env).toEqual({ ...process.env, BRICK_CONFIG: 'prod' });
    expect(engine.config).toEqual({
      ...ENGINE_CONFIG, ...DEFAULT_CONFIG, ...PROD_CONFIG, field: {
        ...DEFAULT_CONFIG.field, ...PROD_CONFIG.field,
        object: {
          ...DEFAULT_CONFIG.field.object, ...PROD_CONFIG.field.object,
        },
      },
    });
  });

  it('custom environment', () => {

    process.env.BRICK_CONFIG = 'custom';

    engine.init();
    expect(engine.env).toEqual({ ...process.env, BRICK_CONFIG: 'custom' });

    const CUSTOM_CONFIG = CUSTOM_CONFIG_FUN(engine.env);
    expect(engine.config).toEqual({
      ...ENGINE_CONFIG, ...DEFAULT_CONFIG, ...CUSTOM_CONFIG, field: {
        ...DEFAULT_CONFIG.field, ...CUSTOM_CONFIG.field,
        object: {
          ...DEFAULT_CONFIG.field.object, ...CUSTOM_CONFIG.field.object,
        },
      },
    });
  });

  it('unknown environment', () => {

    process.env.BRICK_CONFIG = 'unknown';

    engine.init();
    expect(engine.env).toEqual({ ...process.env, BRICK_CONFIG: 'unknown' });
    expect(engine.config).toEqual({ ...ENGINE_CONFIG, ...DEFAULT_CONFIG });

  });

  it('modules environment', () => {

    process.env.BRICK_CONFIG = 'modules';

    engine.init();
    expect(engine.env).toEqual({ ...process.env, BRICK_CONFIG: 'modules' });
    expect(engine.config).toEqual({ ...ENGINE_CONFIG, ...DEFAULT_CONFIG, ...MODULES_CONFIG, engine: { ...ENGINE_CONFIG.engine, ...MODULES_CONFIG.engine } });


    const moduleAFn = jest.fn();
    inject(moduleAFn, { deps: [ 'moduleA' ] });
    engine.use(moduleAFn);

    expect(moduleAFn).toBeCalledTimes(1);
    const moduleA = moduleAFn.mock.calls[0][0];
    const moduleAKeys = Object.keys(moduleA);
    expect(moduleAKeys).toEqual(expect.arrayContaining([ 'modelA', 'modelB', 'modelC' ]));
    expect(moduleA.modelA).toBeInstanceOf(MODEL_A_CLASS);
    expect(moduleA.modelA.constructor.name).toBe(MODEL_A_CLASS.name);
    expect(moduleA.modelA.env).toEqual(engine.env);
    expect(moduleA.modelA.getConfig()).toEqual(engine.config);
    expect(moduleA.modelA.cfg).toEqual(engine.config);
    const keys = Object.keys(MODEL_B);
    for (const key of keys) {
      expect(moduleA.modelB[key]).toEqual(MODEL_B[key]);
    }
    expect(moduleA.modelC.env).toEqual(engine.env);
    expect(moduleA.modelC.getConfig()).toEqual(engine.config);


    const moduleBFn = jest.fn();
    inject(moduleBFn, { deps: [ 'moduleB' ] });
    engine.use(moduleBFn);

    expect(moduleBFn).toBeCalledTimes(1);
    const moduleB = moduleBFn.mock.calls[0][0];
    expect(moduleB).toEqual({});
  });

  it('throw error', () => {

    const error = new Error('test throw error');
    const errorFn = jest.fn(() => { throw error; });
    inject(errorFn, { name: 'errorFn' });

    engine.init();
    engine.install(errorFn);

    const errorModule = jest.fn(() => { throw error; });
    inject(errorModule, { deps: [] });
    expect(() => engine.use(errorModule)).toThrow(error);
    expect(errorModule).toBeCalledTimes(1);

    const module = jest.fn();
    inject(module, { deps: [ 'errorFn' ] });
    expect(() => engine.use(module)).toThrow(error);
    expect(errorFn).toBeCalledTimes(1);
    expect(module).not.toHaveBeenCalled();


  });
});
