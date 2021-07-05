export const PLUGIN_SCOPE: unique symbol;
export const MODULE_KEY: string;
export class MountPlugin {
    /**
     * 插件装载处理插件构造函数
     * @class
     * @param {Engine} engine 引擎实例
     */
    constructor(engine: Engine);
    /**
     *检查是否为匹配插件模块
     * @param {import("../lib/engine").EngineModule} module 检查的模块
     * @return {boolean} true:匹配/false:
     */
    match(module: import("../lib/engine").EngineModule): boolean;
    /**
     *使用插件方法
     * @param {import("../lib/engine").EnginePlugin} module 使用的插件模块
     */
    use(module: import("../lib/engine").EnginePlugin): Promise<void>;
    [ENGINE]: Engine;
}
declare const ENGINE: unique symbol;
import { Engine } from "../lib/engine";
export {};
