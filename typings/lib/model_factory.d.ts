export = ModelFactory;
declare class ModelFactory {
    constructor(engine: any, modules: any);
    create(success: any, fatal: any): void;
    [MODULES]: any;
    [ENGINE]: any;
    [CALLBACKS]: any[];
    [COUNT]: number;
}
declare const MODULES: unique symbol;
declare const ENGINE: unique symbol;
declare const CALLBACKS: unique symbol;
declare const COUNT: unique symbol;
