/**
 * @fileOverview 注入功能
 * @name inject.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { assign, isSymbol, isString, isArray } = require('lodash');

const DEPS = Symbol('deps');
const INJECT = Symbol('inject');
const PROVIDE = Symbol('provide');


/**
 * 依赖对象描述
 * @typedef {Object} Dependency
 * @property {boolean} required 是否必要
 * @property {string} id 唯一标识
 * @property {Function} transform 依赖模块转换
 */

/**
 * 注入可选项
 * @typedef {Object} InjectOpts
 * @property {Array<String | Dependency>} deps 依赖模块项
 * @property {String} name 构造对象命名
 */

/**
 * 构造注入帮助函数,定义构造对象所需要的依赖模块,以及构造对象的命名
 * @param {any} target 注入对象:函数/类/对象等
 * @param {InjectOpts} opts 注入选项
 */
function inject(target, opts) {
  const { deps, name } = assign({ deps: [] }, opts);
  assert(target !== null && target !== undefined, 'inject Error: wrong target');
  assert(isArray(deps), 'inject Error: wrong deps');
  assert(name === undefined || isString(name), 'inject Error: wrong name');
  assert(target[DEPS] === undefined, 'inject Error: duplicate');

  target[DEPS] = deps;
  target[INJECT] = name;

  return target;
}

exports.inject = inject;

/**
 * 提供可选项
 * @typedef {Object} ProvideOpts 提供可选项
 * @property {Array<String | Dependency>} deps 依赖模块项
 * @property {String} property 对象属性名
 */

/**
 * 提供注入函数,将依赖模块设置为对象成员属性
 * @param {any} target 提供对象
 * @param {ProvideOpts} opts 可选项
 */
function provide(target, opts) {
  const { property, dep } = assign({}, opts);
  assert(target !== null && target !== undefined, 'provide Error: wrong target');
  assert(isString(property) || isSymbol(property), 'provide Error: wrong property');
  assert(isDep(dep), 'provide Error: wrong dep');

  if (target[PROVIDE] === undefined) {
    target[PROVIDE] = {};
  }
  const map = target[PROVIDE];
  assert(map[property] === undefined, 'inject Error: duplicate');

  map[property] = dep;
}

exports.provide = provide;

/**
 * 获取inject信息
 * @param {any} module 注入模块
 * @return {InjectOpts} 注入可选项
 */
function getInjectInfo(module) {
  return { name: module[INJECT], deps: module[DEPS] || [] };
}

exports.getInjectInfo = getInjectInfo;

/**
 * 获取Provide信息
 * @param {any} module 注入模块
 * @return {ProvideInfo} Provide定义的信息
 */
function getProvideInfo(module) {
  const properties = module[PROVIDE] || {};
  const deps = [];
  const settings = [];
  const keys = Reflect.ownKeys(properties);
  for (const key of keys) {
    const opts = module[key];
    values.push(opts);
    deps.push(opts.dep);
  }
  return { deps, properties, settings };
}

exports.getProvideInfo = getProvideInfo;
