import Injector = require("./lib/injector");
import { inject } from "./lib/utils";
/**
 * 创建注射器
 * @param {Array<Any>} args 注射器构造参数
 * @return {Injector} 注射器实例
 */
export function createInjector(...args: Array<any>): Injector;
export { Injector, inject };
