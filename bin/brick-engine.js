#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name brick-engine.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */

import * as path from 'path';
import { createEngine } from '../index.js';
import { PACKAGE_NAME } from '../lib/constants.js';
import Debug from 'debug';
import assert from 'assert';

export const MODULE_KEY = `${PACKAGE_NAME}:Engine`;
const debug = Debug(MODULE_KEY);

const appPaths = process.argv.length > 2 ? process.argv.slice(2) : [ path.join(process.cwd(), 'index.js') ];

async function main(paths) {

  debug('main: %s', paths.join(','));
  const modules = await Promise.all(paths.map(_ => import(_)));
  const engine = await createEngine();
  for (const m of modules) {
    const app = m.default || m.App || m.app;
    assert(app, `${MODULE_KEY} install: wrong app`);
    await engine.install(app);
  }

}

main(appPaths).catch(e => console.error(e));
