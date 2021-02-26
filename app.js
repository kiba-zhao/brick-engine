/**
 * @fileOverview 应用入口
 * @name app.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { ENGINE, inject } = require('.');

module.exports = (engine) => {
  const config = engine.config[ENGINE];
  const modelsConfig = config.models;
  if (!modelsConfig) {
    return;
  }

  const keys = Reflect.ownKeys(modelsConfig);
  for (let key of keys) {
    const { patterns, opts } = modelsConfig[key];
    engine.build(patterns, opts, install.bind(engine, key));
  }
};

function install(engine, id, error, targets) {
  if (error) {
    throw error;
  }
  const models = {};
  for (let target of targets) {
    if (target.name) {
      models[target.name] = target.model;
    }
  }
  inject(models, { name: id });
  engine.install(models);
}
