export const DI_SCOPE: unique symbol;
export const MODULE_KEY: string;
export class InjectPlugin {
    /**
     * 依赖注入插件构造函数
     * @class
     * @param {MetadataManager} metadata 元数据管理器实例
     * @param {Provider} provider 提供器实例
   */
    constructor(metadata: MetadataManager, provider: Provider);
    match(module: any): boolean;
    use(module: any): Promise<void>;
    [METADATA]: MetadataManager;
    [PROVIDER]: Provider;
}
declare const METADATA: unique symbol;
import { MetadataManager } from "../lib/metadata_manager";
declare const PROVIDER: unique symbol;
import { Provider } from "../lib/provider";
export {};
