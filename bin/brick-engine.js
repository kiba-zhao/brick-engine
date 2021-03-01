#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name brick-engine.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const Engine = require('../lib/engine');

const engine = new Engine();
engine.init();
