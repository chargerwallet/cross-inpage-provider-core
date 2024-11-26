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
var JsBridgeSimple = /** @class */ (function (_super) {
    __extends(JsBridgeSimple, _super);
    function JsBridgeSimple() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sendAsString = true;
        _this.isInjected = true;
        _this.remote = null;
        _this.callbacksExpireTimeout = 0;
        return _this;
    }
    JsBridgeSimple.prototype.sendPayload = function (payload) {
        if (!this.remote) {
            throw new Error('JsBridgeSimple ERROR: remote not set.');
        }
        this.remote.receive(payload);
    };
    JsBridgeSimple.prototype.setRemote = function (remote) {
        this.remote = remote;
    };
    return JsBridgeSimple;
}(JsBridgeBase));
export { JsBridgeSimple };
