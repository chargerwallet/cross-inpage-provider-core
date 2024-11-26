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
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment */
import { isFunction } from 'lodash-es';
import { CrossEventEmitter } from './CrossEventEmitter';
import siteMetadata from './siteMetadata';
import { fakeLogger, fakeDebugLogger, consoleErrorInDev } from './loggers';
import versionInfo from './versionInfo';
import { WALLET_INFO_LOACAL_KEY_V5 } from './consts';
var METHODS = {
    wallet_getConnectWalletInfo: 'wallet_getConnectWalletInfo',
    wallet_sendSiteMetadata: 'wallet_sendSiteMetadata',
};
var ProviderBase = /** @class */ (function (_super) {
    __extends(ProviderBase, _super);
    function ProviderBase(config) {
        var _a, _b, _c;
        var _this = _super.call(this) || this;
        _this.version = versionInfo.version;
        _this.isOneKey = true;
        _this.debugLogger = fakeDebugLogger;
        _this.logger = fakeLogger;
        if (!config.bridge) {
            throw new Error('ProviderBase init error: bridge required.');
        }
        _this.config = config;
        _this.bridge = config.bridge;
        _this.logger = config.logger || fakeLogger;
        // TODO init this.debugLogger first, and enable debug config after extension connect
        _this.debugLogger = ((_a = _this.bridge) === null || _a === void 0 ? void 0 : _a.debugLogger) || fakeDebugLogger;
        (_c = (_b = _this.bridge) === null || _b === void 0 ? void 0 : _b.debugLogger) === null || _c === void 0 ? void 0 : _c._attachExternalLogger(_this.logger);
        setTimeout(function () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            _this.bridge.attachProviderInstance(_this);
        }, 0);
        return _this;
        // call sendSiteMetadataDomReady/getConnectWalletInfo in ProviderPrivate, dont need here
        // void this.sendSiteMetadataDomReady();
        // void this.getConnectWalletInfo();
    }
    ProviderBase.prototype.configDebugLogger = function (config) {
        try {
            if (!config || !this.bridge.debugLogger) {
                return;
            }
            var debugLogger_1 = this.bridge.debugLogger;
            (config.enabledKeys || []).forEach(function (key) {
                debugLogger_1._createDebugInstance(key);
            });
            if (config.config) {
                debugLogger_1._debug.enable(config.config);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            window.$onekey = window.$onekey || {};
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            window.$onekey.$debugLogger = debugLogger_1;
        }
        catch (error) {
            consoleErrorInDev('configDebugLogger ERROR:', error);
        }
    };
    ProviderBase.prototype.getConnectWalletInfo = function () {
        return __awaiter(this, arguments, void 0, function (_a) {
            var _this = this;
            var _b = _a === void 0 ? {} : _a, _c = _b.timeout, timeout = _c === void 0 ? 3000 : _c;
            return __generator(this, function (_d) {
                // eslint-disable-next-line no-async-promise-executor,@typescript-eslint/no-misused-promises
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var timer, result, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    timer = setTimeout(function () {
                                        console.error("getConnectWalletInfo timeout: ".concat(timeout));
                                        resolve(null);
                                    }, timeout);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, this.bridgeRequest({
                                            method: METHODS.wallet_getConnectWalletInfo,
                                            params: [{ time: Date.now() }],
                                        })];
                                case 2:
                                    result = (_a.sent());
                                    if (result) {
                                        result.providerState = result.providerState || {};
                                    }
                                    if (result && result.debugLoggerConfig) {
                                        this.configDebugLogger(result.debugLoggerConfig);
                                    }
                                    if (result && result.walletInfo) {
                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                        window.$onekey = window.$onekey || {};
                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                        window.$onekey.$walletInfo = result.walletInfo;
                                        try {
                                            localStorage.setItem(WALLET_INFO_LOACAL_KEY_V5, JSON.stringify(result.walletInfo));
                                        }
                                        catch (e) {
                                            console.error(e);
                                        }
                                    }
                                    if (result) {
                                        resolve(result);
                                    }
                                    else {
                                        console.error('getConnectWalletInfo error: result=null');
                                        resolve(null);
                                    }
                                    return [3 /*break*/, 5];
                                case 3:
                                    err_1 = _a.sent();
                                    // TODO wallet not installed, timeout ERROR
                                    consoleErrorInDev('getConnectWalletInfo: ERROR', err_1);
                                    resolve(null);
                                    return [3 /*break*/, 5];
                                case 4:
                                    clearTimeout(timer);
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ProviderBase.prototype.bridgeRequest = function (data, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var hasCallback, payload, resData, result, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        hasCallback = false;
                        if (callback && isFunction(callback)) {
                            hasCallback = true;
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        payload = {
                            data: data !== null && data !== void 0 ? data : {},
                            scope: this.providerName,
                        };
                        this.debugLogger.providerBase('bridgeRequest:', payload, '\r\n -----> ', payload.data);
                        return [4 /*yield*/, this.bridge.request(payload)];
                    case 2:
                        resData = _e.sent();
                        if (resData) {
                            // @ts-ignore
                            resData.id = (_b = (_a = data === null || data === void 0 ? void 0 : data.id) !== null && _a !== void 0 ? _a : resData.id) !== null && _b !== void 0 ? _b : undefined;
                            // @ts-ignore
                            resData.jsonrpc = (_d = (_c = data === null || data === void 0 ? void 0 : data.jsonrpc) !== null && _c !== void 0 ? _c : resData.jsonrpc) !== null && _d !== void 0 ? _d : '2.0';
                        }
                        result = resData ? resData.result : undefined;
                        if (callback && hasCallback) {
                            // callback with params: { id, result, jsonrpc }
                            callback(null, resData);
                        }
                        this.debugLogger.providerBase('bridgeRequest RETURN:', { req: payload, res: resData }, '\r\n -----> ', payload.data, '\r\n -----> ', result);
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _e.sent();
                        if (callback && hasCallback) {
                            // @ts-expect-error
                            callback(error_1);
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProviderBase.prototype.sendSiteMetadataDomReady = function () {
        var _this = this;
        if (document.readyState === 'complete') {
            void this.sendSiteMetadata();
        }
        else {
            var domContentLoadedHandler_1 = function () {
                void _this.sendSiteMetadata();
                window.removeEventListener('DOMContentLoaded', domContentLoadedHandler_1);
            };
            window.addEventListener('DOMContentLoaded', domContentLoadedHandler_1);
        }
    };
    ProviderBase.prototype.sendSiteMetadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, siteMetadata.getSiteMetadata()];
                    case 1:
                        metadata = _a.sent();
                        return [4 /*yield*/, this.bridgeRequest({
                                method: METHODS.wallet_sendSiteMetadata,
                                params: metadata,
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProviderBase.prototype.isConnectionStatusChanged = function (newStatus) {
        return this.connectionStatus === undefined || newStatus !== this.connectionStatus;
    };
    ProviderBase.prototype.isAccountsChanged = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        throw new Error('isAccountsChanged not implemented');
    };
    ProviderBase.prototype.isNetworkChanged = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        throw new Error('isNetworkChanged not implemented');
    };
    return ProviderBase;
}(CrossEventEmitter));
export { ProviderBase };
