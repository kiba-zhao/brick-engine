/**
 * @fileOverview env插件xprovide入口
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { createEnv } = require('.');

/**
 * xprovide提供器入口函数
 * @param {Provider} provider
 */
module.exports = (provider) => {
  provider.define('config', [], createEnv);
};

