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
/**
 *注入元数据方法
 * @param {MetadataTarget} target 注入目标对象
 * @param {Metadata} metadata 元数据内容
 * @param {MetadataOpts} [opts] 元数据可选项
 */
export function inject(target: MetadataTarget, metadata: Metadata, opts?: MetadataOpts): void;
/**
 *提取目标对象的元数据
 * @param {MetadataTarget} target 目标对象
 * @param {MetadataOpts} [opts] 元数据可选项
 * @return {Metadata[]} 目标对象包含的所有元数据列表
 */
export function extract(target: MetadataTarget, opts?: MetadataOpts): Metadata[];
export const MODULE_KEY: string;
/**
 * 元数据
 */
export type Metadata = any;
/**
 * 元数据目标对象
 */
export type MetadataTarget = any;
/**
 * 元数据
 */
export type MetadataScope = any;
/**
 * 元数据可选项
 */
export type MetadataOpts = {
    /**
     * 作用域
     */
    scope?: MetadataScope;
};
