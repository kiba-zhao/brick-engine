/**
 * @fileOverview 生产配置文件
 * @name prod.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const FIELD = {
  string: 'prodstr',
  object: { prodstr: 'prodstr', prodnum: 222 },
  number: 222,
  prodstr: 'prodstr',
  prodnum: 222,
};

exports.field = { ...FIELD };

exports.prod = 'prod';
