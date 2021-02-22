/**
 * @fileOverview 注入器类
 * @name injector.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { isFunction, isPlainObject, isString, isArray } = require('lodash');
const { DEPS, INJECT, PROVIDE } = require('./constants');
const { parseDep } = require('./utils');
const isClass = require('is-class');
const assert = require('assert');

const MODULES = Symbol('modules');
const DEPENDENCIES = Symbol('dependencies');
const STORE = Symbol('store');

/**
 * 提供器可选项
 * @typedef {Object} InjectorOpts
 * @property {Function} validate 是否缓存创建结果
 * @property {Object} store 是否缓存创建结果
 * @property {Array} addins 附加注入
 */

/**
 * 注射器
 * @class
 */
class Injector {
  /**
   *
   * @param {Array<Object> | Loader} loader 加载器
   * @param {InjectorOpts} opts 可选项
   */
  constructor(loader, opts = {}) {

    assert(isPlainObject(opts), 'Injector Error: wrong opts');
    assert(opts.validate === undefined || isFunction(opts.validate), 'Injector Error: wrong opts.validate');
    assert(opts.store === undefined || isPlainObject(opts.store), 'Injector Error: wrong opts.store');
    assert(opts.addins === undefined || isArray(opts.addins), 'Injector Error: wrong opts.addins');

    prepare(this, loader, opts);
  }

  /**
   * 依赖属性
   * @return {Array<Object>} 依赖描述
   */
  get deps() {
    return this[DEPENDENCIES];
  }

  /**
   * 构建注入模型
   * @param {Array<any>} args 注入模块的依赖模块
   * @return {Object} 注入模型
   */
  build(...args) {
    const modules = this.create(...args);
    const model = {};
    for (const module of modules) {
      if (isString(module.name)) {
        model[module.name] = module.model;
      }
    }
    return model;
  }


  /**
   * 创建模块
   * @param {Array<any>} args 注入模块的依赖模块
   */
  * create(...args) {

    const injector = this;
    const store = injector[STORE];
    const ctx = { ...store };
    for (let i = 0; i < injector.deps.length; i++) {
      if (args[i] === undefined) { continue; }
      const key = injector.deps[i].id;
      ctx[key] = args[i];
    }

    const modules = injector[MODULES];
    for (const module of modules) {
      const moduleArgs = [];
      for (const dep of module.args) {
        assert(dep.required === false || ctx[dep.id] !== undefined, `Injector Error: module ${module.path} is pending`);
        moduleArgs.push(ctx[dep.id]);
      }

      let model;
      if (isClass(module.factory)) {
        model = new module.factory(...moduleArgs);
      } else if (isFunction(module.factory)) {
        model = module.factory(...moduleArgs);
      } else {
        model = module.factory;
      }
      model = init(model, ctx, module);
      yield { ...module, model };

    }

  }
}

module.exports = Injector;

/**
 * 注射器准备函数
 * @param {Injector} injector 注射器实例
 * @param {Array<Object> | Loader} loader 加载器实例
 * @param {InjectorOpts} opts 注射器可选项
 */
function prepare(injector, loader, opts) {
  const modules = [];
  const deps = [];
  const cache = {};
  const store = opts.store || {};
  const addins = opts.addins || [];
  for (const item of loader) {

    const module = parse(item, addins);
    assert(opts.validate === undefined || opts.validate(item.module), `Injector Error: ${item.filePath} is invalid!!!`);

    const _deps = [ ...module.deps, ...module.args ];
    for (const dep of _deps) {
      const id = dep.id;
      const required = dep.required;
      if (cache[id] === true || cache[id] === required || store.hasOwnProperty(id)) { continue; }
      cache[id] = required;
      deps.push(dep);
    }

    modules.push(module);
  }

  injector[MODULES] = modules;
  injector[DEPENDENCIES] = deps;
  injector[STORE] = store;

}

/**
 * 分析转换模块函数
 * @param {Object} item 模块项
 * @param {Array<String | Symbol>} addins 附加属性依赖
 * @return {Object} 注入模块信息
 */
function parse(item, addins) {
  const module = item.module;
  const args = module[DEPS] || [];
  const properties = {};

  let props = module[PROVIDE] || {};
  for (const addin of addins) {
    if (!module[addin]) { continue; }
    props = { ...module[addin], ...props };
  }

  const deps = [];
  const keys = Reflect.ownKeys(props);
  for (const key of keys) {
    const dep = parseDep(props[key]);
    deps.push(dep);
    properties[key] = dep;
  }
  return { name: module[INJECT], deps, keys, args, properties, factory: module };
}

/**
 * 初始化模型
 * @param {any} target 模型对象
 * @param {Object} ctx 依赖模块上下文
 * @param {Object} module 注入模块信息
 * @return {any} target
 */
function init(target, ctx, module) {
  const { keys, properties } = module;
  for (const key of keys) {
    const dep = properties[key];
    assert(dep.required === false || ctx[dep.id] !== undefined, `Injector Error: module ${module.path} is pending`);
    Object.defineProperty(target, key, {
      value: ctx[dep.id],
      writable: false,
    });
  }
  return target;
}

