/**
 * 依赖对象描述
 */
export type DepRefer = {
    /**
     * 是否必要
     */
    required: boolean;
    /**
     * 唯一标识
     */
    id: string;
    /**
     * 依赖模块转换
     */
    transform: Function;
};
/**
 * 依赖对象描述
 * @typedef {Object} DepRefer
 * @property {boolean} required 是否必要
 * @property {string} id 唯一标识
 * @property {Function} transform 依赖模块转换
 */
/**
 * 注入帮助函数
 * @param {any} target 注入对象:函数/类/对象等
 * @param {Array<String | DepRefer>} deps 依赖模块项
 * @param {String} name 名称
 */
export function inject(target: any, deps: Array<string | DepRefer>, name: string): any;
/**
 * 提供函数
 * @param {any} target 提供对象
 * @param {String} property 提供属性名
 * @param {String | DepRefer} dep 依赖模块
 */
export function provide(target: any, property: string, dep: string | DepRefer): void;
/**
 * 解析依赖函数
 * @param {string | DepRefer} dep 依赖描述字符串
 * @return {DepRefer} 解析后的依赖对象描述
 */
export function parseDep(dep: string | DepRefer): DepRefer;
