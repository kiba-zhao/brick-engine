/**
 * @fileOverview 注入测试配置文件
 * @name inject.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

exports.inject = {
  modules: {
    moduleA: { patterns: 'moduleA/**/*.js' },
    moduleB: { patterns: 'moduleB/**/*.js' },
  },
};
