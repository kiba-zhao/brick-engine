/**
 * @fileOverview 工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { DEPS, INJECT, PROVIDE } = require('./constants');
const { assign, isSymbol, isString, isArray, isBoolean, isFunction } = require('lodash');

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
  assert(isArray(deps) && deps.every(isDep), 'inject Error: wrong deps');
  assert(name === undefined || isString(name), 'inject Error: wrong name');
  assert(target[DEPS] === undefined, 'inject Error: duplicate');

  target[DEPS] = deps.map(parseDep);
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

const OPTIONAL_KEY = '?';
/**
 * 解析依赖函数
 * @param {string | Dependency} dep 依赖描述字符串
 * @return {Dependency} 解析后的依赖对象描述
 */
function parseDep(dep) {

  if (!isString(dep)) { return dep; }

  let id = dep;
  let required = true;
  if (dep.substr(-1, 1) === OPTIONAL_KEY) {
    id = dep.substr(0, dep.length - 1);
    required = false;
  }
  return { id, required };
}

exports.parseDep = parseDep;

/**
 * 判断是否为为依赖信息函数
 * @param {string | Dependency} dep 依赖信息
 * @return {Boolean} true:是/false:否
 */
function isDep(dep) {
  if (isString(dep)) {
    return true;
  } else if (dep === null || dep === undefined) {
    return false;
  }
  return isString(dep.id) && (isBoolean(dep.required) || dep.required === undefined) && (isFunction(dep.transform) || dep.required === undefined);
}
