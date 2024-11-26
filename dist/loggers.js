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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// @ts-ignore
import createDebugAsync from './debug';
import { DEBUG_LOGGER_STORAGE_KEY } from './consts';
import { CrossEventEmitter } from './CrossEventEmitter';
// enable debugLogger:
//    localStorage.setItem('$$ONEKEY_DEBUG_LOGGER', '*');
function consoleErrorInDev() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var loggerConfig = typeof localStorage !== 'undefined' && localStorage.getItem(DEBUG_LOGGER_STORAGE_KEY);
    if (process.env.NODE_ENV !== 'production' || loggerConfig) {
        console.error.apply(console, args);
    }
}
var fakeLogger = {
    // @ts-ignore
    _isFakeLogger: true,
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return undefined;
    },
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return undefined;
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return undefined;
    },
    debug: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return undefined;
    },
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return undefined;
    },
    trace: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return undefined;
    },
};
var loggerNames;
(function (loggerNames) {
    loggerNames["jsBridge"] = "jsBridge";
    loggerNames["providerBase"] = "providerBase";
    loggerNames["extInjected"] = "extInjected";
    loggerNames["extContentScripts"] = "extContentScripts";
    loggerNames["webview"] = "webview";
    loggerNames["desktopInjected"] = "desktopInjected";
    loggerNames["ethereum"] = "ethereum";
})(loggerNames || (loggerNames = {}));
var FakeDebugLogger = /** @class */ (function (_super) {
    __extends(FakeDebugLogger, _super);
    function FakeDebugLogger() {
        var _this = _super.call(this) || this;
        _this.jsBridge = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return null;
        };
        _this.providerBase = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return null;
        };
        _this.extInjected = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return null;
        };
        _this.extContentScripts = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return null;
        };
        _this.webview = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return null;
        };
        _this.desktopInjected = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return null;
        };
        _this.ethereum = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return null;
        };
        _this._debug = {
            enable: function (config) {
                //noop
            },
        };
        _this._externalLogger = fakeLogger;
        _this._createExternalLog = function (name) {
            return function () {
                var _a, _b;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.once('debugReady', function () {
                    var _a;
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    (_a = _this[name]) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([_this], args, false));
                });
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                return (_b = (_a = _this._externalLogger) === null || _a === void 0 ? void 0 : _a.log) === null || _b === void 0 ? void 0 : _b.call.apply(_b, __spreadArray([_a, "".concat(name, " >>> ")], args, false));
            };
        };
        _this.initExternalLogInstances();
        return _this;
    }
    FakeDebugLogger.prototype.initExternalLogInstances = function () {
        var _this = this;
        Object.keys(loggerNames).forEach(function (name) {
            // @ts-ignore
            _this[name] = _this._createExternalLog(name);
        });
    };
    FakeDebugLogger.prototype.isDebugReady = function () {
        return this._debug && typeof this._debug === 'function';
    };
    FakeDebugLogger.prototype._attachExternalLogger = function (logger) {
        if (logger) {
            this._externalLogger = logger;
        }
    };
    FakeDebugLogger.prototype._createDebugInstance = function (name) {
        // noop
    };
    return FakeDebugLogger;
}(CrossEventEmitter));
var AppDebugLogger = /** @class */ (function (_super) {
    __extends(AppDebugLogger, _super);
    function AppDebugLogger() {
        var _this = _super.call(this) || this;
        _this._debugInstanceCreatedMap = {};
        // TODO createDebugSync
        void createDebugAsync().then(function (debug) {
            _this._debug = debug;
            _this.initDebugInstances();
            _this.emit('debugReady');
        });
        return _this;
    }
    AppDebugLogger.prototype.initDebugInstances = function () {
        var _this = this;
        if (this.isDebugReady()) {
            Object.keys(loggerNames).forEach(function (name) {
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
                _this[name] = _this._debug(name);
            });
        }
    };
    AppDebugLogger.prototype._createDebugInstance = function (name) {
        if (this._debugInstanceCreatedMap[name]) {
            return;
        }
        this._debugInstanceCreatedMap[name] = true;
        if (name && this._debug && typeof this._debug === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            var _debugLog_1 = this._debug(name);
            // @ts-ignore
            var _originLog_1 = this[name];
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            this[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                _debugLog_1.apply(void 0, args);
                if (_originLog_1 && typeof _originLog_1 === 'function') {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    _originLog_1.apply(void 0, args);
                }
            };
        }
    };
    return AppDebugLogger;
}(FakeDebugLogger));
// TODO merge FakeDebugLogger and AppDebugLogger to single class
var fakeDebugLogger = new FakeDebugLogger();
var appDebugLogger = new AppDebugLogger();
export { fakeDebugLogger, appDebugLogger, fakeLogger, consoleErrorInDev };
