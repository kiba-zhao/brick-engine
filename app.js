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
  const modules = config.modules;
  if (!modules) {
    return;
  }

  const keys = Reflect.ownKeys(modules);
  for (let key of keys) {
    const { patterns, opts } = modules[key];
    engine.build(patterns, opts, install.bind(engine, key));
  }
};

function install(engine, name, targets) {
  const factory = moduleFactory.bind(this, targets);
  inject(factory, { name });
  engine.install(factory);
}


function moduleFactory(targets) {
  const module = {};
  for (let target of targets) {
    if (target.name) {
      module[target.name] = target.model;
    }
  }
  return module;
}
