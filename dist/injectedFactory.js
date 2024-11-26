/* eslint-disable @typescript-eslint/ban-ts-comment */
function createCodeWithScriptTag(_a) {
    var code = _a.code;
    // script id check, only inject once.
    return "\n    (function(){\n      const s = document.createElement('script');\n      s.setAttribute('async', 'false');\n      s.setAttribute('data-onekey-injected', 'true');\n      s.textContent=".concat(JSON.stringify(code), ";\n      (document.head || document.documentElement).appendChild(s);\n      s.remove();\n    })();\n  ");
}
function injectCodeWithScriptTag(_a) {
    var code = _a.code, file = _a.file, _b = _a.remove, remove = _b === void 0 ? true : _b;
    (function () {
        var s = document.createElement('script');
        s.removeAttribute('async');
        s.removeAttribute('defer');
        s.setAttribute('data-onekey-injected', 'yes');
        if (code) {
            s.textContent = code;
        }
        if (file) {
            s.src = file;
        }
        s.onload = function () {
            if (remove && file) {
                s.remove();
            }
        };
        (document.head || document.documentElement).appendChild(s);
        if (remove && code) {
            s.remove();
        }
    })();
}
function createCodeJsBridgeReceive(payloadStr) {
    return "\n  if(window.$onekey && window.$onekey.jsBridge){\n    window.$onekey.jsBridge.receive(".concat(JSON.stringify(payloadStr), ");\n  }\n  void 0;\n  ");
}
export default {
    injectCodeWithScriptTag: injectCodeWithScriptTag,
    createCodeWithScriptTag: createCodeWithScriptTag,
    createCodeJsBridgeReceive: createCodeJsBridgeReceive,
};
