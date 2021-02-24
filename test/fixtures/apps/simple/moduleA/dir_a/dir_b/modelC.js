/**
 * @fileOverview 模型C代码
 * @name modelC.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { inject } = require('../../../../../../../');

module.exports = (env, config) => {

  const getConfig = () => config;
  return { env, getConfig };

};

inject(module.exports, { deps: [ 'env', 'config' ], name: 'modelC' });
