/**
 * @fileOverview env插件目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const process = require('process');

/**
 * 创建env环境变量对象函数
 * @param {Object} env 进程环境变量
 * @returns {Object} 环境变量
 */
exports.createEnv = (env = process.env) => {
  let XBLOCK_CONFIG = env.XBLOCK_CONFIG;
  if (XBLOCK_CONFIG === undefined) {
    XBLOCK_CONFIG = env.NODE_ENV === 'production' ? 'prod' : 'local';
  }
  return { ...env, XBLOCK_CONFIG };
};
