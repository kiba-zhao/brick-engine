/**
 * @fileOverview 注入器类
 * @name injector.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { isFunction, isPlainObject, isString } = require('lodash');
const isClass = require('is-class');
const assert = require('assert');
const { parse } = require('comment-parser');
const fs = require('fs');
const path = require('path');

const MODULES = Symbol('modules');
const DEPENDENCIES = Symbol('dependencies');
const MODULE_OPTS = Symbol('moduleOpts');
const STORE = Symbol('store');

/**
 * 提供器可选项
 * @typedef {Object} InjectorOpts
 * @property {Function} validate 是否缓存创建结果
 * @property {Object} store 是否缓存创建结果
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
    assert(opts.store === undefined || isPlainObject(opts.store), 'Injector Error: wrong opts.validate');

    this[MODULE_OPTS] = { encoding: 'utf8' };
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
      for (const dep of module.deps) {
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
  const moduleOpts = injector[MODULE_OPTS];
  const modules = [];
  const deps = [];
  const cache = {};
  const store = opts.store || {};
  for (const item of loader) {

    const module = parseModule(item, moduleOpts);
    if (!module) { continue; }

    assert(opts.validate === undefined || opts.validate(module), `Injector Error: ${module.path} is invalid!!!`);

    for (const dep of module.deps) {
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

const INJECT_TAG = 'inject';
const DEPENDENCY_TAG = 'dependency';
/**
 * 分析转换模块函数
 * @param {Object} item 模块项
 * @param {Object} opts 模块文件读取可选项目
 * @return {Object} 注入模块信息
 */
function parseModule(item, opts) {

  let name;
  const deps = [];
  const modulePath = path.join(item.cwd, item.path);
  const content = fs.readFileSync(modulePath, opts);
  const ast = parse(content);
  for (const block of ast) {
    for (const tag of block.tags) {
      if (tag.tag === INJECT_TAG) {
        name = name || tag.name;
      } else if (tag.tag === DEPENDENCY_TAG) {
        deps.push({ id: tag.name, required: !tag.optional });
      }
    }
  }

  return { name, deps, factory: item.content, path: modulePath };

}
