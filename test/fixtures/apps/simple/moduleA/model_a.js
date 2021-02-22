/**
 * @fileOverview 模型A代码
 * @name model_a.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { inject, provide } = require('../../../../../');

class ModelA {
  constructor(env, config) {
    this._env = env;
    this._config = config;
  }

  get env() {
    return this._env;
  }

  getConfig() {
    return this._config;
  }

}

module.exports = ModelA;

inject(ModelA, [ 'env', 'config?' ], 'modelA');
provide(ModelA, 'cfg', { id: 'config' });
provide(ModelA, 'config', 'config');
