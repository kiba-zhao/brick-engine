export = Injector;
/**
 * 提供器可选项
 * @typedef {Object} InjectorOpts
 * @property {Function} validate 是否缓存创建结果
 * @property {Object} store 是否缓存创建结果
 * @property {Array} addins 附加注入
 */
/**
 * 注射器
 * @class
 */
declare class Injector {
    /**
     *
     * @param {Array<Object> | Loader} loader 加载器
     * @param {InjectorOpts} opts 可选项
     */
    constructor(loader: Array<any> | any, opts?: InjectorOpts);
    /**
     * 依赖属性
     * @return {Array<Object>} 依赖描述
     */
    get deps(): any[];
    /**
     * 构建注入模型
     * @param {Array<any>} args 注入模块的依赖模块
     * @return {Object} 注入模型
     */
    build(...args: Array<any>): any;
    /**
     * 创建模块
     * @param {Array<any>} args 注入模块的依赖模块
     */
    create(...args: Array<any>): Generator<any, void, unknown>;
}
declare namespace Injector {
    export { InjectorOpts };
}
/**
 * 提供器可选项
 */
type InjectorOpts = {
    /**
     * 是否缓存创建结果
     */
    validate: Function;
    /**
     * 是否缓存创建结果
     */
    store: any;
    /**
     * 附加注入
     */
    addins: any[];
};
