declare function createCodeWithScriptTag({ code }: {
    code: string;
}): string;
declare function injectCodeWithScriptTag({ code, file, remove, }: {
    code?: string;
    file?: string;
    remove?: boolean;
}): void;
declare function createCodeJsBridgeReceive(payloadStr: string): string;
declare const _default: {
    injectCodeWithScriptTag: typeof injectCodeWithScriptTag;
    createCodeWithScriptTag: typeof createCodeWithScriptTag;
    createCodeJsBridgeReceive: typeof createCodeJsBridgeReceive;
};
export default _default;
