/**
 * @fileOverview 模型A代码
 * @name model_a.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';
/**
 * @inject modelA 注入模型名称
 * @dependency env 依赖环境变量
 * @dependency config 依赖配置文件
 */
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
