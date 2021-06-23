/**
 * 存储key
 * @typedef {any} ProviderStoreKey
 */
/**
 * 存储内容
 * @typedef {Object} ProviderStoreValue
 * @property {Array<ProviderDependency>} [deps] 依赖对象信息列表
 * @property {any} [model] 实例化对象
 * @property {ProviderFactory} factory 构建工厂
 * @property {boolean} needCache 是否缓存实例化对象
 */
/**
 * 依赖信息
 * @typedef {Object} ProviderDependency
 * @property {ProviderStoreKey} id 依赖对象id
 * @property {boolean} required 依赖是否必要
 */
/**
 * 构建工厂
 * @typedef {Function} ProviderFactory
 */
/**
 * 待处理项
 * @typedef {Object} ProviderPending
 * @property {Array<ProviderDependency>} deps 依赖对象信息列表
 * @property {Function} success 成功回调函数
 * @property {Function} fatal 失败回调函数
 */
export class Provider {
    /**
     * 提供器构造函数
     * @class
     * @param {Map<ProviderStoreKey,ProviderStoreValue>} [store] 存储对象
     */
    constructor(store?: Map<ProviderStoreKey, ProviderStoreValue>);
    /**
     * 获取待处理依赖id列表
     * @readonly
     * @type {IterableIterator<any>}
     */
    readonly get pendings(): IterableIterator<any>;
    /**
     * 是否存在指定模型
     * @param {ProviderStoreKey} id 模型id
     * @return {boolean} 是否存在
     */
    contains(id: ProviderStoreKey): boolean;
    /**
     * 请求依赖模型
     * @param {...ProviderDependency} deps 模型依赖
     * @return {Promise<Array<any>>} 模块数组
     */
    require(...deps: ProviderDependency[]): Promise<Array<any>>;
    /**
     * 定义模型
     * @param {ProviderStoreKey} id 模型Id
     * @param {Array<ProviderDependency>} deps 模型依赖
     * @param {ProviderFactory} factory 模型构建函数或模型本身
     */
    define(id: ProviderStoreKey, deps: Array<ProviderDependency>, factory: ProviderFactory): void;
    /**
     * @private
     * @type {number}
     */
    private [PENDING_COUNT];
    /**
     * @private
     * @readonly
     * @type {Map<ProviderStoreKey,Map<number,ProviderPending>>}
     */
    private readonly [PENDINGS];
    [STORE]: Map<any, ProviderStoreValue>;
}
/**
 * 存储key
 */
export type ProviderStoreKey = any;
/**
 * 存储内容
 */
export type ProviderStoreValue = {
    /**
     * 依赖对象信息列表
     */
    deps?: Array<ProviderDependency>;
    /**
     * 实例化对象
     */
    model?: any;
    /**
     * 构建工厂
     */
    factory: ProviderFactory;
    /**
     * 是否缓存实例化对象
     */
    needCache: boolean;
};
/**
 * 依赖信息
 */
export type ProviderDependency = {
    /**
     * 依赖对象id
     */
    id: ProviderStoreKey;
    /**
     * 依赖是否必要
     */
    required: boolean;
};
/**
 * 构建工厂
 */
export type ProviderFactory = Function;
/**
 * 待处理项
 */
export type ProviderPending = {
    /**
     * 依赖对象信息列表
     */
    deps: Array<ProviderDependency>;
    /**
     * 成功回调函数
     */
    success: Function;
    /**
     * 失败回调函数
     */
    fatal: Function;
};
declare const PENDING_COUNT: unique symbol;
declare const PENDINGS: unique symbol;
declare const STORE: unique symbol;
export {};
