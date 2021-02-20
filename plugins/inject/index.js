/**
 * @fileOverview inject插件目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const Injector = require('./lib/injector');
const { inject } = require('./lib/utils');

exports.Injector = Injector;
exports.inject = inject;

/**
 * 创建注射器
 * @param {Array<Any>} args 注射器构造参数
 * @return {Injector} 注射器实例
 */
function createInjector(...args) {
  return new Injector(...args);
}

exports.createInjector = createInjector;
