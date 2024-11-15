"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleErrorInDev = exports.fakeLogger = exports.appDebugLogger = exports.fakeDebugLogger = void 0;
// @ts-ignore
const debug_1 = __importDefault(require("./debug"));
const consts_1 = require("./consts");
const CrossEventEmitter_1 = require("./CrossEventEmitter");
// enable debugLogger:
//    localStorage.setItem('$$CHARGERWALLET_DEBUG_LOGGER', '*');
function consoleErrorInDev(...args) {
    const loggerConfig = typeof localStorage !== 'undefined' && localStorage.getItem(consts_1.DEBUG_LOGGER_STORAGE_KEY);
    if (process.env.NODE_ENV !== 'production' || loggerConfig) {
        console.error(...args);
    }
}
exports.consoleErrorInDev = consoleErrorInDev;
const fakeLogger = {
    // @ts-ignore
    _isFakeLogger: true,
    log: (...args) => undefined,
    warn: (...args) => undefined,
    error: (...args) => undefined,
    debug: (...args) => undefined,
    info: (...args) => undefined,
    trace: (...args) => undefined,
};
exports.fakeLogger = fakeLogger;
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
class FakeDebugLogger extends CrossEventEmitter_1.CrossEventEmitter {
    constructor() {
        super();
        this.jsBridge = (...args) => null;
        this.providerBase = (...args) => null;
        this.extInjected = (...args) => null;
        this.extContentScripts = (...args) => null;
        this.webview = (...args) => null;
        this.desktopInjected = (...args) => null;
        this.ethereum = (...args) => null;
        this._debug = {
            enable(config) {
                //noop
            },
        };
        this._externalLogger = fakeLogger;
        this._createExternalLog = (name) => (...args) => {
            var _a, _b;
            this.once('debugReady', () => {
                var _a;
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                (_a = this[name]) === null || _a === void 0 ? void 0 : _a.call(this, ...args);
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return (_b = (_a = this._externalLogger) === null || _a === void 0 ? void 0 : _a.log) === null || _b === void 0 ? void 0 : _b.call(_a, `${name} >>> `, ...args);
        };
        this.initExternalLogInstances();
    }
    initExternalLogInstances() {
        Object.keys(loggerNames).forEach((name) => {
            // @ts-ignore
            this[name] = this._createExternalLog(name);
        });
    }
    isDebugReady() {
        return this._debug && typeof this._debug === 'function';
    }
    _attachExternalLogger(logger) {
        if (logger) {
            this._externalLogger = logger;
        }
    }
    _createDebugInstance(name) {
        // noop
    }
}
class AppDebugLogger extends FakeDebugLogger {
    constructor() {
        super();
        this._debugInstanceCreatedMap = {};
        // TODO createDebugSync
        void (0, debug_1.default)().then((debug) => {
            this._debug = debug;
            this.initDebugInstances();
            this.emit('debugReady');
        });
    }
    initDebugInstances() {
        if (this.isDebugReady()) {
            Object.keys(loggerNames).forEach((name) => {
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
                this[name] = this._debug(name);
            });
        }
    }
    _createDebugInstance(name) {
        if (this._debugInstanceCreatedMap[name]) {
            return;
        }
        this._debugInstanceCreatedMap[name] = true;
        if (name && this._debug && typeof this._debug === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            const _debugLog = this._debug(name);
            // @ts-ignore
            const _originLog = this[name];
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            this[name] = (...args) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                _debugLog(...args);
                if (_originLog && typeof _originLog === 'function') {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    _originLog(...args);
                }
            };
        }
    }
}
// TODO merge FakeDebugLogger and AppDebugLogger to single class
const fakeDebugLogger = new FakeDebugLogger();
exports.fakeDebugLogger = fakeDebugLogger;
const appDebugLogger = new AppDebugLogger();
exports.appDebugLogger = appDebugLogger;
