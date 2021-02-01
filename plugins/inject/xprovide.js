/**
 * @fileOverview inject插件xprovide入口
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { createInjector } = require('.');

module.exports = provider => {
  provider.require([ 'boot', 'config' ], (boot, config) => injectorFactory(provider, boot, config.inject));
};

function injectorFactory(provider, boot, configs) {

  if (!configs) {
    return;
  }

  for (const id in configs) {
    const config = configs[id];
    const loader = boot.createBootLoader(config.pattern, boot.context, config.opts || {});
    const injector = createInjector(loader);
    provider.define(id, injector.deps.map(transform), injector.factory);
  }
}

const OPT_SUFFIX = '?';
function transform(dep) {
  return dep.required ? dep.id : dep.id + OPT_SUFFIX;
}

