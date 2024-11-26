/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { JsBridgeBase } from './JsBridgeBase';
var postMessageListenerAdded = false;
/**
 * When the JsBridgeIframe instance changes, the tag can be changed manually
 */
function setPostMessageListenerFlag(value) {
    postMessageListenerAdded = value;
}
function setupPostMessageListener(options) {
    if (options === void 0) { options = {}; }
    if (postMessageListenerAdded) {
        return;
    }
    postMessageListenerAdded = true;
    // - receive
    window.addEventListener('message', function (event) {
        // TODO source whitelist
        /**
         * This origin is not guaranteed to be the current or future origin of the window
         * temporarily comment this line
         */
        // if (event.origin !== options.origin) {
        //   return;
        // }
        var _a, _b, _c;
        var eventData = event.data;
        var config = (_a = options.bridge) === null || _a === void 0 ? void 0 : _a.bridgeConfig;
        if (config &&
            eventData.channel === config.channel &&
            eventData.frameName === config.remoteFrameName) {
            var payload = eventData.payload;
            var jsBridge = (_b = options.bridge) !== null && _b !== void 0 ? _b : (_c = window === null || window === void 0 ? void 0 : window.$onekey) === null || _c === void 0 ? void 0 : _c.jsBridge;
            if (jsBridge) {
                jsBridge.receive(payload);
            }
        }
    }, false);
}
var JsBridgeIframe = /** @class */ (function (_super) {
    __extends(JsBridgeIframe, _super);
    function JsBridgeIframe(config) {
        var _a;
        var _this = _super.call(this, config) || this;
        _this.sendAsString = false;
        _this.isInjected = true;
        _this.bridgeConfig = config;
        _this.targetOrigin = (_a = config.targetOrigin) !== null && _a !== void 0 ? _a : window.location.origin;
        // receive message
        setupPostMessageListener({
            debugLogger: _this.debugLogger,
            bridge: _this,
            origin: _this.targetOrigin,
        });
        return _this;
    }
    // send message
    JsBridgeIframe.prototype.sendPayload = function (payloadObj) {
        var eventData = {
            channel: this.bridgeConfig.channel,
            frameName: this.bridgeConfig.selfFrameName,
            payload: payloadObj,
            direction: '',
        };
        this.bridgeConfig.remoteFrame.postMessage(eventData, this.targetOrigin);
    };
    return JsBridgeIframe;
}(JsBridgeBase));
export { JsBridgeIframe, setPostMessageListenerFlag };
