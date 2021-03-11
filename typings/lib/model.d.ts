/**
 * 构建模型对象
 * @param {Class|Function|any} factory 模块对象构建方法,或者模块对象本身
 * @param {Array<any>} deps 依赖信息
 * @param {Array<any>} modules 依赖模块
 * @return {any} 构建生成的模块
 */
export function buildModel(factory: any | Function | any, deps: Array<any>, ...modules: Array<any>): any;
/**
 * 初始化模型函数
 * @param {Target} target 模型化目标
 * @param {Array<String> | Array<Symbol>} properties 定义的属性名
 * @param {Array<Dep>} deps 依赖信息
 * @param {Array<any>} modules 依赖的模块对象
 * @return {Target} 模型化目标
 */
export function initModel(target: any, properties: Array<string> | Array<Symbol>, deps: Array<any>, modules: Array<any>): any;
