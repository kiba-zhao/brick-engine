/**
 * @fileOverview 应用入口
 * @name app.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { inject } = require('../../../..');

module.exports = engine => {
  const configFactory = inject(() => engine.config, { name: 'config' });
  const envFactory = inject(() => engine.env, { name: 'env' });
  engine.install(configFactory);
  engine.install(envFactory);
};
