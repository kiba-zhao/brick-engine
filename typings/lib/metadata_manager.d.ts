export const MODULE_KEY: string;
/**
 * 元数据
 * @typedef {any} Metadata
 */
export class MetadataManager {
    /**
     * 元数据管理器构造函数
     * @class
     * @param {any} [property] 用于保存记录元数据的属性名
     */
    constructor(property?: any);
    /**
     *注入元数据方法
     * @param {any} target 注入目标对象
     * @param {any} metadata 元数据内容
     */
    inject(target: any, metadata: any): void;
    /**
     *提取目标对象的元数据
     * @param {any} target 目标对象
     * @returns {Metadata[]} 目标对象包含的所有元数据列表
     */
    extract(target: any): Metadata[];
    /**
     * @private
     * @type {number}
     */
    private [METADATA_TARGET_COUNT];
    /**
     * 元数据存储
     * @private
     * @readonly
     * @type {Map<number,Metadata[]>}
     */
    private readonly [METADATA_STORE];
    [METADATA_PROPERTY]: any;
}
/**
 * 元数据
 */
export type Metadata = any;
declare const METADATA_TARGET_COUNT: unique symbol;
declare const METADATA_STORE: unique symbol;
declare const METADATA_PROPERTY: unique symbol;
export {};
