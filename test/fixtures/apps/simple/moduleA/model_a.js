/**
 * @fileOverview 模型A代码
 * @name model_a.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


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

inject(ModelA, { name: 'modelA', deps: [ 'env', 'config?' ] });
provide(ModelA, { property: 'cfg', dep: { id: 'config', transform: _ => _ } });
