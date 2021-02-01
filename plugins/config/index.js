/**
 * @fileOverview config插件目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');
const { isFunction, defaultsDeep } = require('lodash');

/**
 * 创建config对象函数
 * @param {Array<Module>} entries config入口
 * @param {String} env 配置环境变量
 * @param {Object} ctx 上下文环境对象
 * @return {Object} config配置对象
 */
function createConfig(entries, env, ctx) {

  let defaultConfig = {};
  let config = {};
  for (const entry of entries) {
    const name = path.basename(entry.path, '.js');
    const content = isFunction(entry.content) ? entry.content(ctx) : entry.content;
    if (name === env) {
      config = defaultsDeep(content, config);
      continue;
    }
    defaultConfig = defaultsDeep(content, defaultConfig);
  }

  config = defaultsDeep(config, defaultConfig);
  return config;

}

exports.createConfig = createConfig;
