export function createInjector(loader: any): {
    deps: {
        id: string;
        required: boolean;
    }[];
    factory: any;
};
