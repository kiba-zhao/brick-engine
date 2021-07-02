/**
 * @fileOverview 元数据管理器代码文件
 * @name metadata_manager.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import lodash from 'lodash';
import { PACKAGE_NAME } from './constants';

const METADATA_DEFAULT_SCOPE = Symbol('METADATA_DEFAULT_SCOPE');
const METADATA_PROPERTY = Symbol('METADATA_PROPERTY');

export const MODULE_KEY = `${PACKAGE_NAME}:MetadataManager`;
const debug = Debug(MODULE_KEY);
const { isSymbol, isNumber, isString, isBoolean, isUndefined, isNull, isObject } = lodash;

/**
 * 元数据
 * @typedef {any} Metadata
 */

/**
 * 元数据目标对象
 * @typedef {any} MetadataTarget
 */

/**
 * 元数据
 * @typedef {any} MetadataScope
 */

/**
 * 元数据可选项
 * @typedef {Object} MetadataOpts
* @property {MetadataScope} [scope] 作用域
 */

export class MetadataManager {

  /**
     * 元数据管理器构造函数
     * @class
     * @param {any} [property] 用于保存记录元数据的属性名
     */
  constructor(property = METADATA_PROPERTY) {

    debug('new with %s', JSON.stringify(property));

    assert(
      property !== undefined && property !== null,
      `[${MODULE_KEY}] constructor Error: wrong property`
    );

    this[METADATA_PROPERTY] = property;
  }

  /**
   *是否存在元数据
   * @param {MetadataTarget} target 目标对象
   * @param {MetadataOpts} [opts] 元数据可选项
   * @return {boolean} true:存在/false:不存在
   */
  has(target, opts = {}) {
    debug('has %s %s', target, JSON.stringify(opts));
    assert(
      !(isUndefined(target) || isNull(target) || isNumber(target) || isBoolean(target) || isString(target) || isSymbol(target)),
      `[${MODULE_KEY}] has Error: wrong target`
    );
    assert(
      isObject(opts),
      `[${MODULE_KEY}] has Error: wrong opts`
    );

    const property = this[METADATA_PROPERTY];
    const scope = getScope(opts);
    /** @type Map<MetadataScope,Metadata[]> */
    const metadataMap = target[property];
    return metadataMap && metadataMap.has(scope);

  }

  /**
   *注入元数据方法
   * @param {MetadataTarget} target 注入目标对象
   * @param {Metadata} metadata 元数据内容
   * @param {MetadataOpts} [opts] 元数据可选项
   */
  inject(target, metadata, opts = {}) {

    debug('inject %s %s %s', target, JSON.stringify(metadata), JSON.stringify(opts));

    assert(
      !(isUndefined(target) || isNull(target) || isNumber(target) || isBoolean(target) || isString(target) || isSymbol(target)),
      `[${MODULE_KEY}] inject Error: wrong target`
    );
    assert(
      isObject(opts),
      `[${MODULE_KEY}] inject Error: wrong opts`
    );

    const property = this[METADATA_PROPERTY];
    if (target[property] === undefined) {
      target[property] = new Map();
    }

    /** @type Map<MetadataScope,Metadata[]> */
    const metadataMap = target[property];
    const scope = getScope(opts);
    if (!metadataMap.has(scope)) {
      metadataMap.set(scope, []);
    }
    const metadataQueue = metadataMap.get(scope);
    metadataQueue.push(metadata);

  }

  /**
   *提取目标对象的元数据
   * @param {MetadataTarget} target 目标对象
   * @param {MetadataOpts} [opts] 元数据可选项
   * @return {Metadata[]} 目标对象包含的所有元数据列表
   */
  extract(target, opts = {}) {

    debug('extract %s %s', target, JSON.stringify(opts));

    assert(
      !(isUndefined(target) || isNull(target) || isNumber(target) || isBoolean(target) || isString(target) || isSymbol(target)),
      `[${MODULE_KEY}] extract Error: wrong target`
    );
    assert(
      isObject(opts),
      `[${MODULE_KEY}] extract Error: wrong opts`
    );

    const property = this[METADATA_PROPERTY];
    const scope = getScope(opts);
    /** @type Map<MetadataScope,Metadata[]> */
    const metadataMap = target[property];
    if (!metadataMap || !metadataMap.has(scope)) {
      return [];
    }

    const metadataQueue = metadataMap.get(scope);
    return metadataQueue || [];
  }

}

/**
 *获取作用域
 * @param {MetadataOpts} opts 元数据可选项
 * @return {MetadataScope} 元数据作用域
 */
function getScope(opts) {
  return opts.scope === undefined ? METADATA_DEFAULT_SCOPE : opts.scope;
}
