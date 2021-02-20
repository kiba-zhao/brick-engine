/**
 * 注入帮助函数
 * @param {any} target 注入对象:函数/类/对象等
 * @param {Array<String | DepRefer>} deps 依赖模块项
 * @param {String} name 名称
 */
export function inject(target: any, deps: Array<string | any>, name: string): any;
