/**
 * @fileOverview xprovide入口
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { createConfig } = require('.');

module.exports = (provider) => {

  provider.define('config', ['boot', 'env'], configFactory);

};

function configFactory(boot, env) {
  const loader = boot.createBootLoader([`config/${env.CONFIG}.js`, 'config/default.js'], boot.context);
  return createConfig(loader, env.CONFIG, env);
}
