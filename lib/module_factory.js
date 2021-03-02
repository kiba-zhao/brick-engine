/**
 * @fileOverview 模块工厂
 * @name module_factory.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { isFunction } = require('lodash');

const CALLBACKS = Symbol('callbacks');
const MODULES = Symbol('modules');
const ENGINE = Symbol('engine');
const TARGETS = Symbol('targets');
const ERROR = Symbol('error');
const COUNT = Symbol('count');
const MODEL = Symbol('model');

class ModuleFactory {
  constructor(engine, modules, model = false) {
    this[MODULES] = modules;
    this[ENGINE] = engine;
    this[MODEL] = model;
  }

  create(success, fatal) {

    assert(isFunction(success), '[brick-engine ModuleFactory] create Error: wrong success argument');
    assert(fatal === undefined || isFunction(fatal), '[brick-engine ModuleFactory] create Error: wrong fatal argument');

    const count = this[COUNT];
    const error = this[ERROR];
    const targets = this[TARGETS];
    if (count !== undefined && (error || (targets && targets.length >= count))) {
      if (!error) {
        success(targets);
      } else if (fatal) {
        fatal(error);
      } else {
        throw error;
      }
      return;
    }

    let neverBuild = false;
    if (!this[CALLBACKS]) {
      this[CALLBACKS] = [];
      neverBuild = true;
    }
    const callbacks = this[CALLBACKS];
    callbacks.push({ success, fatal });

    if (neverBuild) {
      build(this);
    }
  }
}

module.exports = ModuleFactory;

/**
 * 模块构建函数
 * @param {ModelFactory} factory 模型化工厂
 */
function build(factory) {
  const modules = factory[MODULES];
  const engine = factory[ENGINE];
  const model = factory[MODEL];
  const onComplete = model ? init.bind(this, factory) : onSuccess.bind(this, factory);

  let count = 0;
  for (const m of modules) {
    if (engine[ERROR]) {
      break;
    }
    engine.use(m.module, onComplete, onError.bind(this, factory));
    count++;
  }

  factory[COUNT] = count;
  ready(factory);
}

/**
 * 模型初始化函数
 * @param {ModelFactory} factory 模型化工厂
 * @param {Target} target 模型化目标对象
 */
function init(factory, target) {
  if (factory[ERROR]) {
    return;
  }
  const engine = factory[ENGINE];
  engine.model(target, onSuccess.bind(this, factory), onError.bind(this, factory));
}

/**
 * 异常响应函数
 * @param {ModelFactory} factory 模型化工厂
 * @param {Error} error 异常对象
 */
function onError(factory, error) {
  factory[ERROR] = error;
  ready(factory);
}

/**
 * 成功响应函数
 * @param {ModelFactory} factory 模型化工厂
 * @param {Target} target 模型化目标对象
 */
function onSuccess(factory, target) {
  if (factory[ERROR]) {
    return;
  }
  if (!factory[TARGETS]) {
    factory[TARGETS] = [];
  }
  const targets = factory[TARGETS];
  targets.push(target);
  ready(factory);
}

/**
 * 创建完毕函数
 * @param {ModelFactory} factory 模块构建工厂
 * @throws {Error} 模块构建或模型化中抛出的异常
 */
function ready(factory) {
  const error = factory[ERROR];
  const count = factory[COUNT];
  const targets = factory[TARGETS] || [];
  if (!error && (count === undefined || targets.length < count)) {
    return;
  }

  const callbacks = factory[CALLBACKS];
  let callback = callbacks.pop();
  while (callback) {
    const { success, fatal } = callback;
    if (!error) {
      success(targets);
    } else if (fatal) {
      fatal(error);
    } else {
      throw error;
    }
    callback = callbacks.pop();
  }
}
