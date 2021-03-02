/**
 * @fileOverview 模块目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { ENGINE, PLUGIN } = require('./lib/constants');
const Engine = require('./lib/engine');
const { inject, provide } = require('./lib/inject');

exports.ENGINE = ENGINE;
exports.PLUGIN = PLUGIN;

exports.Engine = Engine;

exports.inject = inject;
exports.provide = provide;
