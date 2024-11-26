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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isPlainObject, isString } from 'lodash-es';
import { CrossEventEmitter } from './CrossEventEmitter';
import { appDebugLogger, consoleErrorInDev } from './loggers';
import { web3Errors } from '@onekeyfe/cross-inpage-provider-errors';
import { IJsBridgeMessageTypes, } from '@onekeyfe/cross-inpage-provider-types';
import versionInfo from './versionInfo';
function toPlainError(errorInfo) {
    return {
        name: errorInfo.name,
        message: errorInfo.message,
        stack: errorInfo.stack,
        code: errorInfo.code,
        data: errorInfo.data,
        key: errorInfo.key, // i18n key
        info: errorInfo.info, // i18n params
        className: errorInfo.className,
        autoToast: errorInfo.autoToast,
        requestId: errorInfo.requestId,
    };
}
function isLegacyExtMessage(payload) {
    var payloadObj = payload;
    return (Boolean(payloadObj.name) &&
        ['onekey-provider-eth', 'onekey-provider-cfx', 'publicConfig'].includes(payloadObj.name));
}
var globalWindow = typeof window !== 'undefined' ? window : global;
var BRIDGE_EVENTS = {
    message: 'message',
    error: 'error',
};
var JsBridgeBase = /** @class */ (function (_super) {
    __extends(JsBridgeBase, _super);
    function JsBridgeBase(config) {
        if (config === void 0) { config = {}; }
        var _a, _b;
        var _this = _super.call(this) || this;
        _this._requestPayloadCache = {};
        _this.isExtUi = false;
        _this.isInjected = false;
        _this.sendAsString = true;
        _this.globalOnMessageEnabled = true;
        _this.providersHub = {
        // name: []
        };
        // Only handle type=REQUEST messages, type=RESPONSE message will be ignored
        _this.globalOnMessage = function (message) { return __awaiter(_this, void 0, void 0, function () {
            var returnValue, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        if (!(this.config.receiveHandler && this.globalOnMessageEnabled)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.config.receiveHandler(message, this)];
                    case 1:
                        returnValue = _a.sent();
                        if (message.id) {
                            this.response({
                                id: message.id,
                                scope: message.scope,
                                remoteId: message.remoteId,
                                data: returnValue,
                                peerOrigin: message.origin,
                            });
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        if (message.id && message.type === IJsBridgeMessageTypes.REQUEST) {
                            this.responseError({
                                id: message.id,
                                scope: message.scope,
                                remoteId: message.remoteId,
                                error: error_1,
                                peerOrigin: message.origin,
                            });
                        }
                        this.emit(BRIDGE_EVENTS.error, error_1);
                        return [3 /*break*/, 5];
                    case 4: return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        _this.version = versionInfo.version;
        _this.remoteInfo = {
            origin: '',
            remoteId: '',
        };
        // TODO increase timeout as hardware sign transaction may take a long time
        //    can set timeout for each callback
        _this.callbacksExpireTimeout = 10 * 60 * 1000;
        _this.debugLogger = appDebugLogger;
        _this.callbacks = [];
        _this.callbackId = 1;
        _this.config = config;
        _this.callbacksExpireTimeout = (_a = config.timeout) !== null && _a !== void 0 ? _a : _this.callbacksExpireTimeout;
        _this.debugLogger = config.debugLogger || appDebugLogger;
        _this.sendAsString = (_b = config.sendAsString) !== null && _b !== void 0 ? _b : _this.sendAsString;
        if (_this.config.receiveHandler) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            _this.on(BRIDGE_EVENTS.message, _this.globalOnMessage);
        }
        _this.on(BRIDGE_EVENTS.error, function (error) {
            consoleErrorInDev('JsBridge ERROR: ', error, {
                code: error === null || error === void 0 ? void 0 : error.code,
            });
        });
        _this.rejectExpiredCallbacks();
        return _this;
    }
    JsBridgeBase.prototype.attachProviderInstance = function (provider) {
        var _a;
        var name = provider.providerName;
        if (name) {
            this.providersHub[name] = (_a = this.providersHub[name]) !== null && _a !== void 0 ? _a : [];
            this.providersHub[name].push(provider);
        }
    };
    JsBridgeBase.prototype.createCallbackId = function () {
        this.callbackId += 1;
        return this.callbackId;
    };
    JsBridgeBase.prototype.createPayload = function (payload, _a) {
        var resolve = _a.resolve, reject = _a.reject;
        var id = payload.id, type = payload.type;
        if (resolve && reject && id && type === IJsBridgeMessageTypes.REQUEST) {
            if (this.callbacks[id]) {
                // TODO custom error
                throw new Error("JsBridge ERROR: callback exists, id=".concat(id));
            }
            this.callbacks[id] = { id: id, resolve: resolve, reject: reject, created: Date.now() };
        }
        // convert to plain error object which can be stringify
        if (payload.error) {
            var errorInfo = payload.error;
            payload.error = toPlainError(errorInfo);
        }
        // delete resolve, reject function which can not be send as string
        payload === null || payload === void 0 ? true : delete payload.resolve;
        payload === null || payload === void 0 ? true : delete payload.reject;
        return payload;
    };
    JsBridgeBase.prototype.send = function (_a) {
        var _this = this;
        var type = _a.type, data = _a.data, error = _a.error, id = _a.id, remoteId = _a.remoteId, _b = _a.sync, sync = _b === void 0 ? false : _b, scope = _a.scope, peerOrigin = _a.peerOrigin;
        var executor = function (resolve, reject) {
            var _a, _b, _c;
            // TODO check resolve when calling without await
            // eslint-disable-next-line @typescript-eslint/naming-convention
            var _id = id;
            // sendSync without Promise cache
            if (!sync && type === IJsBridgeMessageTypes.REQUEST) {
                _id = _this.createCallbackId();
            }
            try {
                var payload = _this.createPayload({
                    id: _id,
                    data: data,
                    error: error,
                    type: type,
                    origin: ((_a = globalWindow === null || globalWindow === void 0 ? void 0 : globalWindow.location) === null || _a === void 0 ? void 0 : _a.origin) || '',
                    peerOrigin: peerOrigin,
                    remoteId: remoteId,
                    scope: scope,
                }, { resolve: resolve, reject: reject });
                var payloadToSend = payload;
                if (_this.sendAsString) {
                    payloadToSend = JSON.stringify(payload);
                }
                // @ts-ignore
                if ((_b = _this.debugLogger.jsBridge) === null || _b === void 0 ? void 0 : _b.enabled) {
                    if (payload && payload.id && payload.type === IJsBridgeMessageTypes.REQUEST) {
                        _this._requestPayloadCache[payload.id] = payload;
                        if (payload.id % 100 === 0) {
                            _this._requestPayloadCache = {};
                        }
                    }
                }
                _this.debugLogger.jsBridge('send', payload, '\r\n ------> ', payload.data, '\r\n ------> ', 
                // @ts-ignore
                (_c = payload.data) === null || _c === void 0 ? void 0 : _c.result);
                _this.sendPayload(payloadToSend);
            }
            catch (error) {
                if (_id) {
                    _this.rejectCallback(_id, error);
                }
                else {
                    _this.emit(BRIDGE_EVENTS.error, error);
                }
            }
        };
        if (sync) {
            executor();
            void 0;
        }
        else {
            return new Promise(executor);
        }
    };
    JsBridgeBase.prototype.rejectCallback = function (id, error) {
        this.processCallback({
            method: 'reject',
            id: id,
            error: error,
        });
    };
    JsBridgeBase.prototype.resolveCallback = function (id, data) {
        this.processCallback({
            method: 'resolve',
            id: id,
            data: data,
        });
    };
    JsBridgeBase.prototype.processCallback = function (_a) {
        var method = _a.method, id = _a.id, data = _a.data, error = _a.error;
        var callbackInfo = this.callbacks[id];
        if (callbackInfo) {
            if (method === 'reject') {
                if (callbackInfo.reject) {
                    callbackInfo.reject(error);
                }
                this.emit(BRIDGE_EVENTS.error, error);
            }
            if (method === 'resolve') {
                if (callbackInfo.resolve) {
                    callbackInfo.resolve(data);
                }
            }
            this.clearCallbackCache(id);
        }
    };
    JsBridgeBase.prototype.rejectExpiredCallbacks = function () {
        var _this = this;
        if (!this.callbacksExpireTimeout) {
            return;
        }
        var now = Date.now();
        var callbacksLength = this.callbacks.length;
        for (var id = 0; id < callbacksLength; id++) {
            var callbackInfo = this.callbacks[id];
            if (callbackInfo && callbackInfo.created) {
                if (now - callbackInfo.created > this.callbacksExpireTimeout) {
                    var error = web3Errors.provider.requestTimeout();
                    this.rejectCallback(id, error);
                }
            }
        }
        setTimeout(function () {
            _this.rejectExpiredCallbacks();
        }, this.callbacksExpireTimeout);
    };
    JsBridgeBase.prototype.clearCallbackCache = function (id) {
        delete this.callbacks[id];
    };
    JsBridgeBase.prototype.receive = function (payloadReceived, sender) {
        var _a, _b, _c, _d, _e;
        if (payloadReceived === void 0) { payloadReceived = ''; }
        var payload = {
            data: null,
        };
        if (isPlainObject(payloadReceived)) {
            payload = payloadReceived;
        }
        if (isString(payloadReceived)) {
            try {
                payload = JSON.parse(payloadReceived);
            }
            catch (error) {
                this.emit(BRIDGE_EVENTS.error, error);
                throw new Error('JsBridge ERROR: JSON.parse payloadReceived failed');
            }
        }
        // !IMPORTANT: force overwrite origin and internal field
        //    DO NOT trust dapp params
        payload.origin = sender === null || sender === void 0 ? void 0 : sender.origin;
        payload.internal = Boolean(sender === null || sender === void 0 ? void 0 : sender.internal);
        // ignore legacy Ext publicConfig message
        if ((sender === null || sender === void 0 ? void 0 : sender.internal) && this.isExtUi && isLegacyExtMessage(payload)) {
            return;
        }
        if (!payload.origin && !this.isInjected) {
            consoleErrorInDev((_a = this === null || this === void 0 ? void 0 : this.constructor) === null || _a === void 0 ? void 0 : _a.name, '[payload.origin] is missing.', this);
            throw new Error('JsBridge ERROR: receive message [payload.origin] is required.');
        }
        if (!payload.internal && !payload.scope) {
            throw new Error('JsBridge ERROR: receive message [payload.scope] is required for non-internal method call.');
        }
        var relatedSendPayload = (_c = this._requestPayloadCache[(_b = payload === null || payload === void 0 ? void 0 : payload.id) !== null && _b !== void 0 ? _b : '']) !== null && _c !== void 0 ? _c : null;
        this.debugLogger.jsBridge('receive', payload, { sender: sender }, '\r\n -----> ', (_e = (_d = payload.data) === null || _d === void 0 ? void 0 : _d.result) !== null && _e !== void 0 ? _e : payload.data, '\r\n <----- ', relatedSendPayload === null || relatedSendPayload === void 0 ? void 0 : relatedSendPayload.data);
        var type = payload.type, id = payload.id, data = payload.data, error = payload.error, origin = payload.origin, remoteId = payload.remoteId;
        this.remoteInfo = {
            origin: origin,
            remoteId: remoteId,
        };
        if (type === IJsBridgeMessageTypes.RESPONSE) {
            if (id === undefined || id === null) {
                throw new Error('JsBridge ERROR: parameter [id] is required in JsBridge.receive() when REQUEST type message');
            }
            var callbackInfo = this.callbacks[id];
            if (callbackInfo) {
                try {
                    if (error) {
                        this.rejectCallback(id, error);
                    }
                    else {
                        this.resolveCallback(id, data);
                    }
                }
                catch (error0) {
                    this.emit(BRIDGE_EVENTS.error, error0);
                }
                finally {
                    // noop
                }
            }
        }
        else if (type === IJsBridgeMessageTypes.REQUEST) {
            var eventMessagePayload = __assign(__assign({}, payload), { created: Date.now() });
            // https://nodejs.org/api/events.html#capture-rejections-of-promises
            // only type=REQUEST message will be handled by globalOnMessage
            this.emit(BRIDGE_EVENTS.message, eventMessagePayload);
        }
        else {
            throw new Error("JsBridge ERROR: payload type not support yet (type=".concat(type || 'undefined', ")"));
        }
    };
    JsBridgeBase.prototype.requestSync = function (_a) {
        var data = _a.data, scope = _a.scope, remoteId = _a.remoteId;
        void this.send({
            id: undefined,
            type: IJsBridgeMessageTypes.REQUEST,
            scope: scope,
            data: data,
            remoteId: remoteId,
            sync: true,
        });
    };
    JsBridgeBase.prototype.request = function (info) {
        var data = info.data, remoteId = info.remoteId, scope = info.scope;
        if (data === undefined) {
            console.warn('JsBridge ERROR: data required. Call like `bridge.request({ data: {...} });`');
        }
        return this.send({
            type: IJsBridgeMessageTypes.REQUEST,
            data: data,
            remoteId: remoteId,
            sync: false,
            scope: scope,
        });
    };
    // send response DATA to remote
    JsBridgeBase.prototype.response = function (_a) {
        var id = _a.id, data = _a.data, remoteId = _a.remoteId, scope = _a.scope, peerOrigin = _a.peerOrigin;
        void this.send({
            type: IJsBridgeMessageTypes.RESPONSE,
            data: data,
            id: id,
            remoteId: remoteId,
            scope: scope,
            sync: true,
            peerOrigin: peerOrigin,
        });
    };
    // send response ERROR to remote
    JsBridgeBase.prototype.responseError = function (_a) {
        var id = _a.id, error = _a.error, scope = _a.scope, remoteId = _a.remoteId, peerOrigin = _a.peerOrigin;
        void this.send({
            type: IJsBridgeMessageTypes.RESPONSE,
            error: error,
            id: id,
            remoteId: remoteId,
            scope: scope,
            sync: true,
            peerOrigin: peerOrigin,
        });
    };
    return JsBridgeBase;
}(CrossEventEmitter));
export { JsBridgeBase, isLegacyExtMessage };
