declare function setup(env: any): Promise<{
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
    /**
     * The currently active debug mode names, and names to skip.
     */
    names: any[];
    skips: any[];
    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */
    formatters: {
        /**
         * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
         */
        j(v: any): string;
    };
    selectColor: (namespace: any) => any;
}>;
export default setup;
