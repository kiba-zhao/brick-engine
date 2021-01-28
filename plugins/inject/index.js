/**
 * @fileOverview inject插件目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { isFunction } = require('lodash');
const { parse } = require('comment-parser');
const fs = require('fs');

function createInjector(loader) {
  const modules = [];
  const deps = [];
  const ids = [];
  const depsCache = {};
  for (let item of loader) {
    const module = parseModule(item);
    if (!module || !module.name)
      continue;
    for (let dep of module.deps) {
      if (depsCache[dep.id] === true)
        continue;
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
    if (args[i] === undefined)
      continue;
    depsCache[deps[i]] = args[i];
  }

  const injectModule = {};
  for (let module of modules) {
    const moduleDeps = [];
    for (let dep of module.deps) {
      assert(dep.required === false || depsCache[dep.id] !== undefined, `Plugin Inject Error: module ${module.name} is pending`);
      moduleDeps.push(depsCache[dep.id]);
    }
    injectModule[module.name] = isFunction(module.factory) ? module.factory(...moduleDeps) : module.factory;
  }
  return injectModule;
}

const INJECT_TAG = 'inject';
const DEPENDENCY_TAG = 'dependency';
function parseModule(item) {
  let name, deps = [];
  const content = fs.readFileSync(item.path, { encoding: 'utf8' });
  const ast = parse(content);
  for (let block of ast) {
    for (let tag of block.tags) {
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
