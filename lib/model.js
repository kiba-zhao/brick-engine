/**
 * @fileOverview 模型集合构建类
 * @name model_builder.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { isFunction } = require('lodash');
const isClass = require('is-class');

/**
 * 构建模型对象
 * @param {Class|Function|any} factory 模块对象构建方法,或者模块对象本身
 * @param {Array<any>} args 构建参数
 * @return {any} 构建生成的模块
 */
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

/**
 * 初始化模型函数
 * @param {Target} target 模型化目标
 * @param {Array<String> | Array<Symbol>} properties 定义的属性名
 * @param {Array<Dep>} deps 依赖信息
 * @param {Array<any>} modules 依赖的模块对象
 * @return {Target} 模型化目标
 */
function initModel(target, properties, deps, modules) {
  let index = 0;
  const model = target.model;
  for (const module of modules) {
    const property = properties[index];
    const opts = deps[index];
    index++;
    Object.defineProperty(model, property, {
      value: opts.transform ? opts.transform(module) : module,
      writable: false,
    });

  }
  return target;
}

exports.initModel = initModel;
