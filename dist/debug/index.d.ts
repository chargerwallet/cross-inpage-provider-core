declare function createDebugAsync(): Promise<{
    (namespace: any): {
        (...args: any[]): void;
        namespace: any;
        useColors: any;
        color: any;
        extend: (namespace: any, delimiter: any) => any;
        destroy: () => void;
    };
    debug: any;
    default: any;
    coerce: (val: any) => any;
    disable: () => string;
    enable: (namespaces: any) => Promise<void>;
    enabled: (name: any) => boolean;
    humanize: any;
    destroy: () => void;
    names: any[];
    skips: any[];
    formatters: {
        j(v: any): string;
    };
    selectColor: (namespace: any) => any;
}>;
export default createDebugAsync;
