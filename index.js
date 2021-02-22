/**
 * @fileOverview 模块目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { inject, provide } = require('./plugins/inject');

exports.inject = inject;
exports.provide = provide;