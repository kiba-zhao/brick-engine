/**
 * @fileOverview 模型工厂类
 * @name model_factory.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const CALLBACKS = Symbol('callbacks');
const MODULES = Symbol('modules');
const ENGINE = Symbol('engine');
const READY = Symbol('ready');
const TARGETS = Symbol('targets');
const ERROR = Symbol('error');
const COUNT = Symbol('count');

class ModelFactory {
  constructor(engine, modules) {
    this[MODULES] = modules;
    this[ENGINE] = engine;
    this[COUNT] = build(this);
    ready(this);
  }

  create(callback) {
    const ready = this[READY];
    const error = this[ERROR];
    const targets = this[TARGETS];
    if (ready && (error || targets)) {
      callback(error, error ? null : targets);
      return;
    }

    if (!this[CALLBACKS]) {
      this[CALLBACKS] = [];
    }
    const callbacks = this[CALLBACKS];
    callbacks.push(callback);
  }
}

module.exports = ModelFactory;

function onError(factory, error) {
  factory[ERROR] = error;
  complete(factory);
}

function onSuccess(factory, target) {
  if (this[ERROR]) {
    return;
  }
  if (!factory[TARGETS]) {
    factory[TARGETS] = [];
  }
  const targets = factory[TARGETS];
  targets.push(target);
  complete(factory);
}


function build(factory) {
  const modules = factory[MODULES];
  const engine = factory[ENGINE];

  let count = 0;
  for (let m of modules) {
    if (this[ERROR]) {
      break;
    }
    engine.use(m.module, init.bind(this, factory), onError.bind(this, factory));
    count++;
  }
  return count;
}

function init(factory, target) {
  if (this[ERROR]) {
    return;
  }
  const engine = factory[ENGINE];
  engine.model(target, onSuccess.bind(this, factory), onError.bind(this, factory));
}

function ready(factory) {
  factory[READY] = true;
  complete(factory);
}

function complete(factory) {
  const ready = factory[READY];
  if (!ready) {
    return;
  }

  const callbacks = this[CALLBACKS];
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
    callback(error, error ? null : targets);
    callback = callbacks.pop();
  }
}

