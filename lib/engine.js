/**
 * @fileOverview 引擎功能类
 * @name engine.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { assign, isFunction } = require('lodash');
const isClass = require('is-class');
const { BootLoader } = require('xboot');

const { ENGINE } = require('./constants');
const { createEnv } = require('./env');
const { createConfig } = require('./config');
const Provider = require('./provider');
const { getInjectInfo, getProvideInfo } = require('./inject');
const { buildModel, initModel } = require('./model');
const ModelFactory = require('./model_factory');

const ENV = Symbol('env');
const OPTIONS = Symbol('options');
const CONFIG = Symbol('config');
const PROVIDER = Symbol('provider');

class Engine {
  constructor(opts = {}) {
    this[OPTIONS] = assign({ config: 'boot.js', context: {} }, opts);
    this[PROVIDER] = new Provider();
  }

  get env() {
    return this[ENV];
  }

  get config() {
    return this[CONFIG];
  }

  install(module, silent = false) {
    assert(module !== undefined && module !== null, '[brick-engine Engine] install Error: wrong module');

    const provider = this[PROVIDER];
    const { name, deps } = getInjectInfo(module);
    if (silent && !name) {
      return false;
    }
    provider.define(name, deps, (...modules) => buildModel(module, ...modules));
    return true;
  }

  use(module, success, fatal) {
    assert(module !== undefined && module !== null, '[brick-engine Engine] use Error: wrong module');
    assert(isFunction(success) || success === undefined, '[brick-engine Engine] use Error: wrong success');
    assert(isFunction(fatal) || fatal === undefined, '[brick-engine Engine] use Error: wrong fatal');

    const provider = this[PROVIDER];
    const { name, deps } = getInjectInfo(module);
    if (deps.length > 0) {
      let fn;
      if (success) {
        fn = (...modules) => success({ name, module, model: buildModel(module, ...modules) });
      } else {
        fn = (...modules) => buildModel(module, ...modules);
      }
      provider.require(deps, fn, fatal);
    } else {
      try {
        let model = buildModel(module, this);
        if (success) {
          success({ name, module, model });
        }
      } catch (err) {
        if (fatal) {
          fatal(err);
        }
      }

    }
  }

  model(target, success, fatal) {
    assert(target !== undefined && target !== null, '[brick-engine Engine] model Error: wrong target');
    assert(target.module !== undefined && target.module !== null, '[brick-engine Engine] target.module Error: wrong module');
    assert(target.model !== undefined && target.model !== null, '[brick-engine Engine] target.model Error: wrong target.model');
    assert(isFunction(success) || success === undefined, '[brick-engine Engine] initModel Error: wrong success argument');
    assert(isFunction(fatal) || fatal === undefined, '[brick-engine Engine] initModel Error: wrong fatal argument');

    const provider = this[PROVIDER];
    const { deps, properties, settings } = getProvideInfo(target.module);
    if (deps.length <= 0) {
      success(target);
    }

    let fn;
    if (success) {
      fn = (...modules) => success(initModel(target, properties, settings, modules));
    } else {
      fn = (...modules) => initModel(target, properties, settings, modules);
    }
    provider.require(deps, fn, fatal);

  }

  load(patterns, opts = {}) {
    const options = assign(opts, this[OPTIONS]);
    const modules = new BootLoader(patterns, options);
    return modules;
  }

  build(patterns, opts, success, fatal) {

    assert(success === undefined || isFunction(success), '[brick-engine Engine] create Error: wrong success argument');
    assert(fatal === undefined || isFunction(fatal), '[brick-engine ModelFactory] create Error: wrong fatal argument');

    const modules = this.load(patterns, opts);
    const factory = new ModelFactory(this, modules);
    if (success) {
      factory.create(success, fatal);
    }
    return factory;
  }

  init() {
    const env = this[ENV] = createEnv();
    const configModules = engine.load([`config/${env.BRICK_CONFIG}.js`, 'config/default.js']);
    const config = this[CONFIG] = createConfig(configModules, env.BRICK_CONFIG, env);
    const apps = this.load(config.app);
    for (let app of apps) {
      const module = app.module;
      if (isFunction(module) || isClass(module)) {
        this.use(module);
      }
    }
  }

}

module.exports = Engine;
