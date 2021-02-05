/**
 * @fileOverview 插件配置文件
 * @name plugin.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

exports.provide = {
  package: 'xprovide',
};

exports.config = {
  package: './plugins/config',
};

exports.env = {
  package: './plugins/env',
};

exports.inject = {
  package: './plugins/inject',
};

exports.log = {
  package: './plugins/log4js',
};
