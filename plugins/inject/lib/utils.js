/**
 * @fileOverview 工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { DEPS, INJECT } = require('./constants');
const { isString, isArray, isBoolean } = require('lodash');

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

  target[DEPS] = _deps.map(parseDep);
  target[INJECT] = name;

  return target;
}

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
  return isString(dep.id) && (isBoolean(dep.required) || dep.required === undefined);
}


exports.inject = inject;
