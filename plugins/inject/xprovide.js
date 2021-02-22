/**
 * @fileOverview inject插件xprovide入口
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const inject = require('.');

module.exports = provider => {
  provider.define('inject', [], inject);
  provider.require([ 'boot', 'config' ], (boot, config) => injectorFactory(provider, boot, config.inject));

};

function injectorFactory(provider, boot, config) {

  if (!config || !config.modules) {
    return;
  }

  const modules = config.modules;
  for (const id in modules) {
    const module = modules[id];
    const loader = boot.createBootLoader(module.patterns, boot.context, module.opts || {});
    const injector = inject.createInjector(loader, { addins: config.addins });
    provider.define(id, injector.deps, injector.build.bind(injector));
  }
}
