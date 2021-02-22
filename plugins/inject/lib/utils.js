/**
 * @fileOverview 工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { DEPS, INJECT, PROVIDE } = require('./constants');
const { isSymbol, isString, isArray, isBoolean, isFunction } = require('lodash');


/**
 * 依赖对象描述
 * @typedef {Object} DepRefer
 * @property {boolean} required 是否必要
 * @property {string} id 唯一标识
 * @property {Function} transform 依赖模块转换
 */

/**
 * 注入帮助函数
 * @param {any} target 注入对象:函数/类/对象等
 * @param {Array<String | DepRefer>} deps 依赖模块项
 * @param {String} name 名称
 */
function inject(target, deps, name) {
  const _deps = deps || [];
  assert(target !== null && target !== undefined, 'inject Error: wrong target');
  assert(isArray(_deps) && _deps.every(isDep), 'inject Error: wrong deps');
  assert(name === undefined || isString(name), 'inject Error: wrong name');
  assert(target[DEPS] === undefined, 'inject Error: duplicate');

  target[DEPS] = _deps.map(parseDep);
  target[INJECT] = name;

  return target;
}

exports.inject = inject;

/**
 * 提供函数
 * @param {any} target 提供对象
 * @param {String} property 提供属性名
 * @param {String | DepRefer} dep 依赖模块
 */
function provide(target, property, dep) {
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
 * @param {string | DepRefer} dep 依赖描述字符串
 * @return {DepRefer} 解析后的依赖对象描述
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
 * @param {string | DepRefer} dep 依赖信息
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
