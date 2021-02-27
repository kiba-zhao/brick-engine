export = Engine;
declare class Engine {
    constructor(opts?: {});
    get env(): any;
    get config(): any;
    install(module: any, silent?: boolean): boolean;
    use(module: any, success: any, fatal: any): void;
    model(target: any, success: any, fatal: any): void;
    load(patterns: any, opts?: {}): BootLoader;
    build(patterns: any, opts: any, success: any, fatal: any): ModelFactory;
    init(): void;
    [OPTIONS]: {
        config: string;
        context: {};
    };
    [PROVIDER]: Provider;
    [ENV]: any;
    [CONFIG]: any;
}
import { BootLoader } from "xboot";
import ModelFactory = require("./model_factory");
declare const OPTIONS: unique symbol;
declare const PROVIDER: unique symbol;
import Provider = require("./provider");
declare const ENV: unique symbol;
declare const CONFIG: unique symbol;
