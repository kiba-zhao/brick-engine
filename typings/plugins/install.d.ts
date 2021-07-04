export const MODULE_SCOPE: unique symbol;
export const MODULE_KEY: string;
export class InstallPlugin {
    /**
     * 模块安装插件构造函数
     * @class
     * @param {MetadataManager} metadata 元数据管理器实例
     * @param {Engine} engine 引擎实例
     */
    constructor(metadata: MetadataManager, engine: Engine);
    match(module: any): boolean;
    use(module: any): Promise<void>;
    [METADATA]: MetadataManager;
    [ENGINE]: Engine;
}
declare const METADATA: unique symbol;
import { MetadataManager } from "../lib/metadata_manager";
declare const ENGINE: unique symbol;
import { Engine } from "../lib/engine";
export {};
