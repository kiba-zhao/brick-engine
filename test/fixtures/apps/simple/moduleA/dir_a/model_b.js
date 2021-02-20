/**
 * @fileOverview 模型B代码
 * @name model_b.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { inject } = require('../../../../../../');

const _exports = {};

_exports.string = 'model_b';

_exports.number = 123;

_exports.object = { a: 1, b: '2', c: true };

module.exports = _exports;

inject(module.exports, [], 'modelB');
