/**
 * @fileOverview 提供器代码文件
 * @name provider.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */

import Debug from 'debug';
import assert from 'assert';
import lodash from 'lodash';
import isClass from 'is-class';
import { PACKAGE_NAME } from './constants';

const PENDING_COUNT = Symbol('PENDING_COUNT');
const STORE = Symbol('STORE');
const PENDINGS = Symbol('PENDINGS');

export const MODULE_KEY = `${PACKAGE_NAME}:Provider`;
const debug = Debug(MODULE_KEY);
const { isMap, isArray, isFunction, isBoolean, isUndefined, isNull } = lodash;

/**
 * 存储key
 * @typedef {any} ProviderStoreKey
 */

/**
 * 存储内容
 * @typedef {Object} ProviderStoreValue
 * @property {Array<ProviderDependency>} [deps] 依赖对象信息列表
 * @property {any} [model] 实例化对象
 * @property {ProviderFactory} factory 构建工厂
 */

/**
 * 依赖信息
 * @typedef {Object} ProviderDependency
 * @property {ProviderStoreKey} id 依赖对象id
 * @property {boolean} required 依赖是否必要
 */

/**
 * 构建工厂
 * @typedef {Function} ProviderFactory
 */

/**
 * 待处理项
 * @typedef {Object} ProviderPending
 * @property {Array<ProviderDependency>} deps 依赖对象信息列表
 * @property {Function} success 成功回调函数
 * @property {Function} fatal 失败回调函数
 */

export class Provider {
  /**
   * @private
   * @type {number}
   */
  [PENDING_COUNT] = 0;

  /**
   * @private
   * @readonly
   * @type {Map<ProviderStoreKey,Map<number,ProviderPending>>}
   */
  [PENDINGS] = new Map();

  /**
   * 提供器构造函数
   * @class
   * @param {Map<ProviderStoreKey,ProviderStoreValue>} [store] 存储对象
   */
  constructor(store = new Map()) {
    assert(
      isMap(store),
      `[${MODULE_KEY}] constructor Error: wrong store`
    );
    this[STORE] = store;
  }

  /**
   * 获取待处理依赖id列表
   * @readonly
   * @type {IterableIterator<any>}
   */
  get pendings() {

    const pendings = this[PENDINGS];

    debug('pendings %s', pendings.keys());
    return pendings.keys();
  }

  /**
   * 是否存在指定模型
   * @param {ProviderStoreKey} id 模型id
   * @return {boolean} 是否存在
   */
  contains(id) {
    debug('contains  %s', id);
    return this[STORE].has(id);
  }

  /**
   * 请求依赖模型
   * @param {...ProviderDependency} deps 模型依赖
   * @return {Promise<Array<any>>} 模块数组
   */
  async require(...deps) {

    debug('require %s', deps);

    assert(
      isArray(deps) && deps.every(isProviderDependency),
      `[${MODULE_KEY}] require Error: wrong deps argument`
    );

    if (deps.length <= 0) {
      return deps;
    }

    const miss_deps = check(this, deps);
    if (miss_deps.length <= 0) {
      const provider = this;
      return new Promise((resolve, reject) => {
        create(provider, { deps, success: resolve, fatal: reject });
      });
    }

    const pendings = this[PENDINGS];
    const key = ++this[PENDING_COUNT];
    const handle = new Promise((resolve, reject) => {
      for (const dep of miss_deps) {
        if (!pendings.has(dep.id)) {
          pendings.set(dep.id, new Map());
        }
        const pending_map = pendings.get(dep.id);
        pending_map.set(key, { deps, success: resolve, fatal: reject });
      }
    });

    return await handle;
  }

  /**
   * 定义模型
   * @param {ProviderStoreKey} id 模型Id
   * @param {Array<ProviderDependency>} deps 模型依赖
   * @param {ProviderFactory} factory 模型构建函数或模型本身
   */
  define(id, deps, factory) {

    debug('define %s depend on %s', id, deps);

    assert(
      isProviderStoreKey(id),
      `[${MODULE_KEY}] define Error: wrong id argument`
    );
    assert(
      isArray(deps) && deps.every(isProviderDependency),
      `[${MODULE_KEY}] define Error: wrong deps argument`
    );
    assert(
      isFunction(factory) || isClass(factory),
      `[${MODULE_KEY}] define Error: wrong factory argument`
    );

    const store = this[STORE];
    assert(
      !store.has(id),
      `[${MODULE_KEY}] define Error: duplicate ${id.toString()}`
    );
    assert(
      deps.every(_ => _.id !== id),
      `[${MODULE_KEY}] define Error: circular ${id.toString()}`
    );

    store.set(id, { deps, factory });

    const pendings = this[PENDINGS].get(id);
    if (!pendings) {
      return;
    }

    this[PENDINGS].delete(id);

    const miss_deps = check(this, deps);
    if (miss_deps.length > 0) {
      for (const dep of miss_deps) {
        /** @type Map<number,ProviderPending> */
        let dep_pendings;
        if (this[PENDINGS].has(dep.id)) {
          dep_pendings = new Map([ ...this[PENDINGS].get(dep.id), ...pendings ]);
        } else {
          dep_pendings = new Map(pendings);
        }
        this[PENDINGS].set(dep.id, dep_pendings);
      }
      return;
    }

    for (const pending of pendings.values()) {
      const pending_miss_deps = check(this, pending.deps);
      if (pending_miss_deps.length > 0) {
        continue;
      }
      create(this, pending);
    }
  }
}

/**
 * 判断是否为提供器存储key
 * @param {ProviderStoreKey} key 存储key
 * @return {Boolean} true:是/false:否
 */
function isProviderStoreKey(key) {
  return !isNull(key) && !isUndefined(key);
}

/**
 * 判断是否为依赖信息数据
 * @param {ProviderDependency} dep 依赖信息
 * @return {Boolean} true:是/false:否
 */
function isProviderDependency(dep) {
  if (!dep) {
    return false;
  }
  return (
    isProviderStoreKey(dep.id) &&
    (isBoolean(dep.required) || dep.required === undefined)
  );
}

/**
 * 检查不可用依赖项
 * @param {Provider} provider 提供器对象实例
 * @param {Array<ProviderDependency>} deps 依赖描述字符串
 * @param {Map<ProviderStoreKey,boolean>} cache 检查缓存字典(对于多个依赖于同一个依赖项，缓存该依赖项检查结果)
 * @param {Map<ProviderStoreKey,boolean>} ingores 忽略字典(用于检查是否存在循环依赖)
 * @return {Array<ProviderDependency>} 不可用依赖项描述
 */
function check(provider, deps, cache = new Map(), ingores = new Map()) {
  const store = provider[STORE];
  const miss_deps = [];
  for (const dep of deps) {

    debug('check with Dependency  %s', dep);

    const { id, required } = dep;
    assert(
      !ingores.has(id),
      `[${MODULE_KEY}] check Error:Circular dependency ${id.toString()}`
    );

    if (required === false) {
      continue;
    }

    if (cache.has(id)) {
      continue;
    }

    let dep_miss_deps = [ dep ];
    const item = store.get(id);
    if (item) {
      cache.set(id, true);
      if (!isUndefined(item.model)) {
        continue;
      }
      if (!item.deps || item.deps.length <= 0) {
        continue;
      }

      ingores = new Map(ingores);
      ingores.set(id, true);
      dep_miss_deps = check(provider, item.deps, cache, ingores);
      if (dep_miss_deps.length <= 0) {
        continue;
      }
    }
    cache.set(id, false);
    miss_deps.push(...dep_miss_deps);
  }

  return miss_deps;
}

/**
 * 构建模块
 * @param {Provider} provider 提供器对象实例
 * @param {Array<ProviderDependency>} deps 依赖描述对象数组
 * @param {Function} action 执行函数
 * @return {any} 执行函数的执行结果
 */
function buildModel(provider, deps, action) {

  if (deps.length <= 0) {
    return isClass(action) ? new action() : action();
  }

  const store = provider[STORE];
  const args = [];
  for (const dep of deps) {

    debug('buildModel with Dependency  %s', dep);

    const { id, required } = dep;
    const item = store.get(id);

    let model;
    if (item) {
      if (isUndefined(item.model)) {
        model = item.model = buildModel(provider, item.deps, item.factory);
      } else {
        model = item.model;
      }
    } else {
      assert(
        required === false,
        `[${MODULE_KEY}] buildModel Error:dep ${id.toString()} is required`
      );
    }

    args.push(model);
  }

  return isClass(action) ? new action(...args) : action(...args);
}

/**
 * 工厂对象创建函数
 * @param {Provider} provider 提供器对象实例
 * @param {ProviderPending} pending 待构建参数
 * @throws {Error} 抛出构建依赖模块异常
 */
function create(provider, pending) {
  const { deps, success, fatal } = pending;

  try {
    buildModel(provider, deps, (...args) => success(args));
  } catch (e) {
    fatal(e);
  }
}
