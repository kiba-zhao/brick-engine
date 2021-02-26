/**
 * @fileOverview 环境变量功能
 * @name env.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * 创建env环境变量对象函数
 * @param {Object} [env=process.env] 进程环境变量
 * @return {Object} 环境变量
 */
function createEnv(env = process.env) {
  let BRICK_CONFIG = env.BRICK_CONFIG;
  if (BRICK_CONFIG === undefined) {
    BRICK_CONFIG = env.NODE_ENV === 'production' ? 'prod' : 'local';
  }
  return { ...env, BRICK_CONFIG };
}

exports.createEnv = createEnv;
