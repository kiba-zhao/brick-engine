/**
 * @fileOverview 日志插件提供器入口文件
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const log4js = require('log4js');

module.exports = provider => {
  provider.define('log', [ 'config' ], logFactory);
};

function logFactory(config) {
  if (config.log !== undefined) {
    log4js.configure(config.log);
  }
  return log4js;
}
