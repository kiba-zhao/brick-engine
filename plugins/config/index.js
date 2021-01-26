/**
 * @fileOverview 目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');
const { isFunction, defaultsDeep } = require('lodash');

function createConfig(entries, env, ctx) {

  let defaultConfig = {};
  let config = {};
  for (let entry of entries) {
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

module.createConfig = createConfig;
