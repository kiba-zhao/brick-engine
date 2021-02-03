/**
 * @fileOverview 模型C代码
 * @name modelC.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * @inject modelC 注入模型名称
 * @dependency env 依赖环境变量
 * @dependency config 依赖配置文件
 */
module.exports = function(env, config) {

  const getConfig = () => config;
  return { env, getConfig };

};
