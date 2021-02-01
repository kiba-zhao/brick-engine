/**
 * @fileOverview 默认配置
 * @name default.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

exports.all = { a: true, b: 123, c: { c1: 123 } };

const FIELD = {
  string: 'str',
  object: { objstr: 'objstr', objnum: 123 },
  number: 123,
};

exports.field = { ...FIELD };

exports.string = 'str';

exports.number = 123;
