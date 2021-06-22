export = Engine;
declare class Engine {
    /**
     * 引擎构造函数
     * @param {Object} opts BootLoader可选参数
     */
    constructor(opts?: any);
    /**
     * 构造可选参数
     * @return {Object} 构建可选项
     */
    get options(): any;
    /**
     * 环境变量
     * @return {Object} 环境变量
     */
    get env(): any;
    /**
     * 配置文件内容
     * @return {Object} 配置文件
     */
    get config(): any;
    /**
     * 安装模块方法,将模块生成交由引擎控制
     * @param {any} module 模块的构建方法
     * @param {Boolean} silent 静默处理:设置忽略未命名模块
     * @return {Boolean} 返回安装结果
     */
    install(module: any, silent?: boolean): boolean;
    /**
     * 模型化目标
     * @typedef {Object} Target
     * @property {any} module 模块构造函数,或模块对象(包含inject函数定义的对象)
     * @property {String} name 模块命名
     * @property {any} model 模块实例对象
     */
    /**
     * 使用引擎管理的模块
     * @param {any} module 模块的构建方法
     * @param {Function} success 成功回调函数
     * @param {Function} fatal 失败回调函数
     * @throws {Error} 获取模块中抛出的异常
     */
    use(module: any, success: Function, fatal: Function): void;
    /**
     * 模型化方法：根据provide函数设置的信息,给引擎生成的模块定义成员属性
     * @param {Target} target 模型化目标
     * @param {Function} success 成功回调函数
     * @param {Function} fatal 失败回调函数
     */
    model(target: {
        /**
         * 模块构造函数,或模块对象(包含inject函数定义的对象)
         */
        module: any;
        /**
         * 模块命名
         */
        name: string;
        /**
         * 模块实例对象
         */
        model: any;
    }, success: Function, fatal: Function): void;
    /**
     * 加载文件模块方法
     * @param {String | Array<String>} patterns 匹配文件规则
     * @param {Object} opts BootLoader可选参数
     * @return {Array<any>} 匹配的文件模块
     */
    load(patterns: string | Array<string>, opts?: any): Array<any>;
    /**
     * 模块构建方法：加载文件模块后,将其模型化
     * @param {String | Array<String>} patterns 匹配文件规则
     * @param {Object} opts BootLoader可选参数
     * @param {Function} success 成功回调函数
     * @param {Function} fatal 失败回调函数
     * @return {ModuleFactory} 模型工厂
     */
    build(patterns: string | Array<string>, opts: any, success: Function, fatal: Function): ModuleFactory;
    /**
     * 初始化引擎方法
     */
    init(): void;
    [OPTIONS]: any;
    [PROVIDER]: any;
    [ENV]: any;
    [CONFIG]: any;
}
import ModuleFactory = require("./module_factory");
declare const OPTIONS: unique symbol;
declare const PROVIDER: unique symbol;
declare const ENV: unique symbol;
declare const CONFIG: unique symbol;
