/**
 * 注入帮助函数
 * @param {any} target 注入对象:函数/类/对象等
 * @param {Array<String | DepRefer>} deps 依赖模块项
 * @param {String} name 名称
 */
export function inject(target: any, deps: Array<string | any>, name: string): any;
/**
 * 提供函数
 * @param {any} target 提供对象
 * @param {String} property 提供属性名
 * @param {String | DepRefer} dep 依赖模块
 */
export function provide(target: any, property: string, dep: string | any): void;
/**
 * 解析依赖函数
 * @param {string | DepRefer} dep 依赖描述字符串
 * @return {DepRefer} 解析后的依赖对象描述
 */
export function parseDep(dep: string | any): any;
