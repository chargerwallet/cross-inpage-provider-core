"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectJsBridge = void 0;
const loggerConsole_1 = require("./loggerConsole");
// function fixGlobalShim() {
//   // FIX errors in ReactNative
//   //    ReferenceError: Can't find variable: global
//   // @ts-ignore
//   window.global = window.global || window || window.globalThis;
//   // @ts-ignore
//   window.global = window.global || window || window.globalThis;
// }
function injectJsBridge(bridgeCreator) {
    // remove fixGlobalShim,
    // because fixGlobalShim make some website not work properly
    //  make cloudfare dead loop and make zhihu.com search functionally down
    // fixGlobalShim();
    var _a;
    if (!((_a = window === null || window === void 0 ? void 0 : window.$chargerwallet) === null || _a === void 0 ? void 0 : _a.jsBridge)) {
        window.$chargerwallet = window.$chargerwallet || {};
        window.$chargerwallet.jsBridge = bridgeCreator();
        loggerConsole_1.commonLogger.debug('JsBridge injected success!', performance.now());
    }
    return window.$chargerwallet.jsBridge;
}
exports.injectJsBridge = injectJsBridge;