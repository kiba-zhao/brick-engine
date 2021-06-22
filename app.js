/**
 * @fileOverview 应用入口
 * @name app.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


const { ENGINE } = require('./lib/constants');
const { inject } = require('./lib/inject');

module.exports = engine => {

  const factory = engineFactory.bind(this, engine);
  inject(factory, { name: ENGINE });
  engine.install(factory);

  const config = engine.config.engine;
  const modules = config.modules;
  if (!modules) {
    return;
  }

  const keys = Reflect.ownKeys(modules);
  for (const key of keys) {
    const { patterns, opts } = modules[key];
    engine.build(patterns, opts, install.bind(this, engine, key));
  }
};

function install(engine, name, targets) {

  const factory = moduleFactory.bind(this, targets);
  inject(factory, { name });
  engine.install(factory);
}


function moduleFactory(targets) {
  const module = {};
  if (!targets) {
    return module;
  }

  for (const target of targets) {
    if (target.name) {
      module[target.name] = target.model;
    }
  }
  return module;
}

function engineFactory(engine) {
  return engine;
}
