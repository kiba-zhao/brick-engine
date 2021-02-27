/**
 * @fileOverview 配置文件功能
 * @name config.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');
const { isFunction } = require('lodash');
const merge = require('deepmerge');

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
    const { plugin, path: filepath, module } = entry;
    const name = path.basename(filepath, '.js');
    const content = isFunction(module) ? module(ctx) : module;

    if (name === env) {
      config = merge.all(plugin ? [ content, config ] : [ config, content ]);
      continue;
    }
    defaultConfig = merge.all(plugin ? [ content, defaultConfig ] : [ defaultConfig, content ]);

  }

  config = merge(defaultConfig, config);
  return config;

}

exports.createConfig = createConfig;
