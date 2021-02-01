/**
 * @fileOverview config插件xprovide入口
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { createConfig } = require('.');

/**
 * xprovide提供器入口函数
 * @param {Provider} provider 提供器对象实例
 */
module.exports = provider => {
  provider.define('config', [ 'boot', 'env' ], configFactory);
};

/**
 * config配置生成工厂函数
 * @param {xboot} boot 引导模块
 * @param {Object} env 环境变量对象
 * @return {Object} config配置对象
 */
function configFactory(boot, env) {
  const loader = boot.createBootLoader([ `config/${env.XBLOCK_CONFIG}.js`, 'config/default.js' ], boot.context);
  return createConfig(loader, env.XBLOCK_CONFIG, env);
}
