/**
 * @fileOverview 模型集合构建类
 * @name model_builder.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { isFunction } = require('lodash');
const isClass = require('is-class');

function buildModel(factory, ...args) {
  let model;
  if (isClass(factory)) {
    model = new factory(...args);
  } else if (isFunction(factory)) {
    model = factory(...args);
  } else {
    model = factory;
  }
  return model;
}

exports.buildModel = buildModel;

function initModel(target, properties, settings, modules) {
  let index = 0;
  const model = target.model;
  for (const module of modules) {
    const property = properties[index];
    const opts = settings[index];
    index++;
    Object.defineProperty(model, property, {
      value: opts.transform ? opts.transform(module) : module,
      writable: false,
    });

  }
  return target;
}

exports.initModel = initModel;
