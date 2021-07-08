export const DI_SCOPE: unique symbol;
export const MODULE_KEY: string;
export class InjectPlugin {
    /**
     * 依赖注入插件构造函数
     * @class
     * @param {Provider} provider 提供器实例
   */
    constructor(provider: Provider);
    match(module: any): boolean;
    use(module: any): Promise<void>;
    [PROVIDER]: Provider;
}
declare const PROVIDER: unique symbol;
import { Provider } from "../lib/provider.js";
export {};
