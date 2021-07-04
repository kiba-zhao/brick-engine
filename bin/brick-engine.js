#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name brick-engine.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { createEngine } from '../lib';

const app = null;
createEngine().then(engine=>{
  engine.install(app);
});
