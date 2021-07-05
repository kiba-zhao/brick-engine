export const MODULE_SCOPE: unique symbol;
export const MODULE_KEY: string;
export class InstallPlugin {
    /**
     * 模块安装插件构造函数
     * @class
     * @param {Engine} engine 引擎实例
     */
    constructor(engine: Engine);
    /**
     *检查是否为匹配模块
     * @param {import("../lib/engine").EngineModule} module 检查的模块
     * @return {boolean} true:匹配/false:不匹配
     */
    match(module: import("../lib/engine").EngineModule): boolean;
    /**
     *使用模块方法
     * @param {import("../lib/engine").EngineModule} module 使用的模块
     */
    use(module: import("../lib/engine").EngineModule): Promise<void>;
    [ENGINE]: Engine;
}
declare const ENGINE: unique symbol;
import { Engine } from "../lib/engine";
export {};
