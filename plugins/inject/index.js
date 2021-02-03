/**
 * @fileOverview inject插件目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { isFunction } = require('lodash');
const isClass = require('is-class');
const { parse } = require('comment-parser');
const fs = require('fs');
const path = require('path');

function createInjector(loader) {
  const modules = [];
  const deps = [];
  const ids = [];
  const depsCache = {};
  for (const item of loader) {
    const module = parseModule(item);
    if (!module || !module.name) { continue; }
    for (const dep of module.deps) {
      if (depsCache[dep.id] === true) { continue; }
      deps.push(dep);
      ids.push(dep.id);
      depsCache[dep.id] = dep.required;
    }
    modules.push(module);
  }
  return { deps, factory: createInjectModule.bind(this, ids, modules) };
}

function createInjectModule(deps, modules, ...args) {
  const depsCache = {};
  for (let i = 0; i < deps.length; i++) {
    if (args[i] === undefined) { continue; }
    depsCache[deps[i]] = args[i];
  }

  const injectModule = {};
  for (const module of modules) {
    const moduleDeps = [];
    for (const dep of module.deps) {
      assert(dep.required === false || depsCache[dep.id] !== undefined, `Plugin Inject Error: module ${module.name} is pending`);
      moduleDeps.push(depsCache[dep.id]);
    }

    if (isClass(module.factory)) {
      injectModule[module.name] = new module.factory(...moduleDeps);
    } else if (isFunction(module.factory)) {
      injectModule[module.name] = module.factory(...moduleDeps);
    } else {
      injectModule[module.name] = module.factory;
    }
  }
  return injectModule;
}

const INJECT_TAG = 'inject';
const DEPENDENCY_TAG = 'dependency';
function parseModule(item) {
  let name;
  const deps = [];
  const content = fs.readFileSync(path.join(item.cwd, item.path), { encoding: 'utf8' });
  const ast = parse(content);
  for (const block of ast) {
    for (const tag of block.tags) {
      if (tag.tag === INJECT_TAG) {
        name = name || tag.name;
      } else if (tag.tag === DEPENDENCY_TAG) {
        deps.push({ id: tag.name, required: !tag.optional });
      }
    }
  }

  const factory = item.content;
  return { name, deps, factory };
}

exports.createInjector = createInjector;
