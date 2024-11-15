"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPostMessageListenerFlag = exports.JsBridgeIframe = void 0;
const JsBridgeBase_1 = require("./JsBridgeBase");
let postMessageListenerAdded = false;
/**
 * When the JsBridgeIframe instance changes, the tag can be changed manually
 */
function setPostMessageListenerFlag(value) {
    postMessageListenerAdded = value;
}
exports.setPostMessageListenerFlag = setPostMessageListenerFlag;
function setupPostMessageListener(options = {}) {
    if (postMessageListenerAdded) {
        return;
    }
    postMessageListenerAdded = true;
    // - receive
    window.addEventListener('message', (event) => {
        // TODO source whitelist
        /**
         * This origin is not guaranteed to be the current or future origin of the window
         * temporarily comment this line
         */
        // if (event.origin !== options.origin) {
        //   return;
        // }
        var _a, _b, _c;
        const eventData = event.data;
        const config = (_a = options.bridge) === null || _a === void 0 ? void 0 : _a.bridgeConfig;
        if (config &&
            eventData.channel === config.channel &&
            eventData.frameName === config.remoteFrameName) {
            const payload = eventData.payload;
            const jsBridge = (_b = options.bridge) !== null && _b !== void 0 ? _b : (_c = window === null || window === void 0 ? void 0 : window.$chargerwallet) === null || _c === void 0 ? void 0 : _c.jsBridge;
            if (jsBridge) {
                jsBridge.receive(payload);
            }
        }
    }, false);
}
class JsBridgeIframe extends JsBridgeBase_1.JsBridgeBase {
    constructor(config) {
        var _a;
        super(config);
        this.sendAsString = false;
        this.isInjected = true;
        this.bridgeConfig = config;
        this.targetOrigin = (_a = config.targetOrigin) !== null && _a !== void 0 ? _a : window.location.origin;
        // receive message
        setupPostMessageListener({
            debugLogger: this.debugLogger,
            bridge: this,
            origin: this.targetOrigin,
        });
    }
    // send message
    sendPayload(payloadObj) {
        const eventData = {
            channel: this.bridgeConfig.channel,
            frameName: this.bridgeConfig.selfFrameName,
            payload: payloadObj,
            direction: '',
        };
        this.bridgeConfig.remoteFrame.postMessage(eventData, this.targetOrigin);
    }
}
exports.JsBridgeIframe = JsBridgeIframe;
