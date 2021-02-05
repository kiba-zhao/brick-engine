/**
 * @fileOverview 日志插件测试配置
 * @name log.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');

exports.log = {
  appenders: {
    app: { type: 'file', filename: path.join(__dirname, '..', 'app.log') },
  },
  categories: {
    default: { appenders: [ 'app' ], level: 'debug' },
  },
};
