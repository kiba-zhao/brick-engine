export = ModelFactory;
declare class ModelFactory {
    /**
     * 模型工厂构造方法
     * @param {Engine} engine 引擎
     * @param {Array<FileModule>} modules 文件模块
     */
    constructor(engine: any, modules: Array<any>);
    /**
     * 创建方法
     * @param {Function} success 成功回调函数
     * @param {Function} fatal 失败回调函数
     * @throws {Error} 模块化中抛出的异常
     */
    create(success: Function, fatal: Function): void;
    [MODULES]: any[];
    [ENGINE]: any;
    [CALLBACKS]: any[];
    [COUNT]: number;
}
declare const MODULES: unique symbol;
declare const ENGINE: unique symbol;
declare const CALLBACKS: unique symbol;
declare const COUNT: unique symbol;
