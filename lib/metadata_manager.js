/**
 * @fileOverview 元数据管理器代码文件
 * @name metadata_manager.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import assert from 'assert';
import { PACKAGE_NAME } from './constants';

const METADATA_TARGET_COUNT = Symbol('METADATA_TARGET_COUNT');
const METADATA_STORE = Symbol('METADATA_STORE');
const METADATA_PROPERTY = Symbol('METADATA_PROPERTY');

export const MODULE_KEY = `${PACKAGE_NAME}:MetadataManager`;
const debug = Debug(MODULE_KEY);

/**
 * 元数据
 * @typedef {any} Metadata
 */

export class MetadataManager {

  /**
   * @private
   * @type {number}
   */
  [METADATA_TARGET_COUNT] = 0;

  /**
   * 元数据存储
   * @private
   * @readonly
   * @type {Map<number,Metadata[]>}
   */
  [METADATA_STORE] = new Map();

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
   *注入元数据方法
   * @param {any} target 注入目标对象
   * @param {any} metadata 元数据内容
   */
  inject(target, metadata) {

    debug('inject %s %s', target, JSON.stringify(metadata));

    assert(
      target !== undefined && target !== null,
      `[${MODULE_KEY}] inject Error: wrong target`
    );

    const property = this[METADATA_PROPERTY];
    if (target[property] === undefined) {
      target[property] = ++this[METADATA_TARGET_COUNT];
    }
    /** @type number */
    const key = target[property];

    const store = this[METADATA_STORE];
    if (!store.has(key)) {
      store.set(key, []);
    }
    const metadataQueue = store.get(key);
    metadataQueue.push(metadata);

  }

  /**
   *提取目标对象的元数据
   * @param {any} target 目标对象
   * @return {Metadata[]} 目标对象包含的所有元数据列表
   */
  extract(target) {

    debug('extract %s %s', target);

    assert(
      target !== undefined && target !== null,
      `[${MODULE_KEY}] extract Error: wrong target`
    );

    const property = this[METADATA_PROPERTY];
    const key = target[property];

    const store = this[METADATA_STORE];
    return key !== undefined && store.has(key) ? [] : store.get(key);
  }

}
