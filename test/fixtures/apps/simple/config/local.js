/**
 * @fileOverview 本地开发配置
 * @name local.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const FIELD = {
  string: 'localstr',
  object: { localstr: 'localstr', localnum: 111 },
  number: 111,
  localstr: 'localstr',
  localnum: 111,
};

exports.field = { ...FIELD };

exports.local = 'local';
