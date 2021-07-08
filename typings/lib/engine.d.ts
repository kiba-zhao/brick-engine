export const MODULE_KEY: string;
/**
 * 引擎插件构建器
 * @typedef {any} EnginePlugin
 */
/**
 * 引擎模块
 * @typedef {any} EngineModule
 */
export class Engine {
    /**
     * 引擎构造函数
     * @class
     * @param {Provider} provider 提供器实例
     */
    constructor(provider: Provider);
    /**
     * 引擎可选项
     * @typedef {Object} EngineMountOpts
     * @property {import("./provider").ProviderDependency[]} [deps] 依赖项列表
     */
    /**
     *挂载插件
     * @param {EnginePlugin} Plugin 插件构建器
     * @param {EngineMountOpts} opts 挂载可选项
     */
    mount(Plugin: EnginePlugin, opts?: {
        /**
         * 依赖项列表
         */
        deps?: import("./provider").ProviderDependency[];
    }): Promise<void>;
    /**
     *安装模块
     * @param {EngineModule} module 需要安装的模块
     */
    install(module: EngineModule): Promise<void>;
    /**
     * @private
     * @readonly
     * @type {EngineModule[]}
     */
    private readonly [ENGINE_MODULES];
    /**
     * @private
     * @readonly
     * @type {EnginePlugin[]}
     */
    private readonly [ENGINE_PLUGINS];
    [ENGINE_PROVIDER]: Provider;
}
/**
 * 引擎插件构建器
 */
export type EnginePlugin = any;
/**
 * 引擎模块
 */
export type EngineModule = any;
declare const ENGINE_MODULES: unique symbol;
declare const ENGINE_PLUGINS: unique symbol;
declare const ENGINE_PROVIDER: unique symbol;
import { Provider } from "./provider.js";
export {};
