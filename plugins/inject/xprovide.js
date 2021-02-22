/**
 * @fileOverview inject插件xprovide入口
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { isFunction } = require('lodash');
const inject = require('.');

module.exports = provider => {
  provider.require([ 'boot', 'config' ], (boot, config) => injectorFactory(provider, boot, config.inject));

};

function injectorFactory(provider, boot, config) {


  const addins = getAddins(boot);
  provider.define('inject', [], { ...inject, addins });

  if (!config) { return; }

  const modules = config;
  for (const id in modules) {
    const module = modules[id];
    const loader = boot.createBootLoader(module.patterns, boot.context, module.opts || {});
    const injector = inject.createInjector(loader, { addins });
    provider.define(id, injector.deps, injector.build.bind(injector));
  }
}

function getAddins(boot) {
  const addins = [];
  const loader = boot.createBootLoader('inject.js', boot.context);
  for (const item of loader) {
    if (!isFunction(item.module)) { continue; }
    addins.push(item.module);
  }
  return addins;
}

