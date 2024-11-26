var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { DEBUG_LOGGER_STORAGE_KEY } from './consts';
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["LOG"] = 1] = "LOG";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
function getStoredLogConfig() {
    if (typeof localStorage === 'undefined') {
        return undefined;
    }
    var config = localStorage.getItem(DEBUG_LOGGER_STORAGE_KEY);
    if (config !== null) {
        try {
            var level = parseInt(config, 10);
            if (level in LogLevel) {
                return level;
            }
        }
        catch (_a) {
            return undefined;
        }
    }
    return undefined;
}
function setStoredLogConfig(config) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(DEBUG_LOGGER_STORAGE_KEY, config.toString());
    }
}
var Logger = /** @class */ (function () {
    function Logger(module) {
        if (module === void 0) { module = null; }
        this.module = module;
        var config = getStoredLogConfig();
        this.level = config !== null && config !== void 0 ? config : LogLevel.DEBUG;
        if (process.env.NODE_ENV === 'production') {
            this.level = config !== null && config !== void 0 ? config : LogLevel.ERROR;
        }
    }
    Logger.prototype.shouldLog = function (level) {
        return level >= this.level;
    };
    Logger.prototype.formatMessage = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.module ? __spreadArray(["[".concat(this.module, "]:")], args, true) : args;
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug.apply(console, this.formatMessage.apply(this, args));
        }
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.shouldLog(LogLevel.LOG)) {
            console.log.apply(console, this.formatMessage.apply(this, args));
        }
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn.apply(console, this.formatMessage.apply(this, args));
        }
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error.apply(console, this.formatMessage.apply(this, args));
        }
    };
    return Logger;
}());
var commonLogger = new Logger();
export { Logger, LogLevel, commonLogger, setStoredLogConfig };
