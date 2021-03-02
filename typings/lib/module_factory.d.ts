export = ModuleFactory;
declare class ModuleFactory {
    constructor(engine: any, modules: any, model?: boolean);
    create(success: any, fatal: any): void;
    [MODULES]: any;
    [ENGINE]: any;
    [MODEL]: boolean;
    [CALLBACKS]: any[];
}
declare const MODULES: unique symbol;
declare const ENGINE: unique symbol;
declare const MODEL: unique symbol;
declare const CALLBACKS: unique symbol;
