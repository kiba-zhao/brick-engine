/**
 * @fileOverview 模型工厂类
 * @name model_factory.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { isFunction } = require('lodash');

const CALLBACKS = Symbol('callbacks');
const MODULES = Symbol('modules');
const ENGINE = Symbol('engine');
const READY = Symbol('ready');
const TARGETS = Symbol('targets');
const ERROR = Symbol('error');
const COUNT = Symbol('count');

class ModelFactory {
  /**
   * 模型工厂构造方法
   * @param {Engine} engine 引擎
   * @param {Array<FileModule>} modules 文件模块
   */
  constructor(engine, modules) {
    this[MODULES] = modules;
    this[ENGINE] = engine;
  }

  /**
   * 创建方法
   * @param {Function} success 成功回调函数
   * @param {Function} fatal 失败回调函数
   * @throws {Error} 模块化中抛出的异常
   */
  create(success, fatal) {

    assert(isFunction(success), '[brick-engine ModelFactory] create Error: wrong success argument');
    assert(fatal === undefined || isFunction(fatal), '[brick-engine ModelFactory] create Error: wrong fatal argument');

    const ready = this[READY];
    const error = this[ERROR];
    const targets = this[TARGETS];
    if (ready && (error || targets)) {
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
      this[COUNT] = build(this);
      doReady(this);
    }
  }
}

module.exports = ModelFactory;

/**
 * 异常响应函数
 * @param {ModelFactory} factory 模型化工厂
 * @param {Error} error 异常对象
 */
function onError(factory, error) {
  factory[ERROR] = error;
  complete(factory);
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
  complete(factory);
}


/**
 * 构建函数
 * @param {ModelFactory} factory 模型化工厂
 * @return {Number} 模型化模块计数
 */
function build(factory) {
  const modules = factory[MODULES];
  const engine = factory[ENGINE];

  let count = 0;
  for (const m of modules) {
    if (engine[ERROR]) {
      break;
    }
    engine.use(m.module, init.bind(this, factory), onError.bind(this, factory));
    count++;
  }
  return count;
}

/**
 * 初始化函数
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
 * 准备完成函数
 * @param {ModelFactory} factory 模型化工厂
 */
function doReady(factory) {
  factory[READY] = true;
  complete(factory);
}

/**
 * 创建完毕函数
 * @param {ModelFactory} factory 模型化工厂
 * @throws {Error} 模型化中抛出的异常
 */
function complete(factory) {
  const ready = factory[READY];
  if (!ready) {
    return;
  }

  const callbacks = factory[CALLBACKS];
  if (!callbacks || callbacks.length <= 0) {
    return;
  }

  const error = factory[ERROR];
  const targets = factory[TARGETS];
  const count = factory[COUNT];
  if (!error && (targets ? targets.length < count : count > 0)) {
    return;
  }

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
