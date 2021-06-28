export const MODULE_KEY: string;
/**
 * 引擎可选项
 * @typedef {Object} EngineOpts
 * @property {Provider} [provider] 提供器对象
 * @property {MetadataManager} [metadata] 元数据管理器对象
 */
export class Engine {
    /**
     * 提供器构造函数
     * @class
     * @param {EngineOpts} [opts] 引擎可选项
     */
    constructor(opts?: EngineOpts);
    [ENGINE_METADATA]: MetadataManager;
    [ENGINE_PROVIDER]: Provider;
}
/**
 * 引擎可选项
 */
export type EngineOpts = {
    /**
     * 提供器对象
     */
    provider?: Provider;
    /**
     * 元数据管理器对象
     */
    metadata?: MetadataManager;
};
declare const ENGINE_METADATA: unique symbol;
import { MetadataManager } from "./metadata_manager";
declare const ENGINE_PROVIDER: unique symbol;
import { Provider } from "./provider";
export {};
