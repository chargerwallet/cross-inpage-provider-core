"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
function createCodeWithScriptTag({ code }) {
    // script id check, only inject once.
    return `
    (function(){
      const s = document.createElement('script');
      s.setAttribute('async', 'false');
      s.setAttribute('data-chargerwallet-injected', 'true');
      s.textContent=${JSON.stringify(code)};
      (document.head || document.documentElement).appendChild(s);
      s.remove();
    })();
  `;
}
function injectCodeWithScriptTag({ code, file, remove = true, }) {
    (function () {
        const s = document.createElement('script');
        s.removeAttribute('async');
        s.removeAttribute('defer');
        s.setAttribute('data-chargerwallet-injected', 'yes');
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
    return `
  if(window.$chargerwallet && window.$chargerwallet.jsBridge){
    window.$chargerwallet.jsBridge.receive(${JSON.stringify(payloadStr)});
  }
  void 0;
  `;
}
exports.default = {
    injectCodeWithScriptTag,
    createCodeWithScriptTag,
    createCodeJsBridgeReceive,
};
