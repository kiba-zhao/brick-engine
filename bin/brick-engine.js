#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name xboot.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */

const Engine = require('../lib/engine');

const engine = new Engine();
engine.start();
