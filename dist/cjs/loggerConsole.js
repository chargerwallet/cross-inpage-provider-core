"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStoredLogConfig = exports.commonLogger = exports.LogLevel = exports.Logger = void 0;
const consts_1 = require("./consts");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["LOG"] = 1] = "LOG";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
exports.LogLevel = LogLevel;
function getStoredLogConfig() {
    if (typeof localStorage === 'undefined') {
        return undefined;
    }
    const config = localStorage.getItem(consts_1.DEBUG_LOGGER_STORAGE_KEY);
    if (config !== null) {
        try {
            const level = parseInt(config, 10);
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
        localStorage.setItem(consts_1.DEBUG_LOGGER_STORAGE_KEY, config.toString());
    }
}
exports.setStoredLogConfig = setStoredLogConfig;
class Logger {
    constructor(module = null) {
        this.module = module;
        const config = getStoredLogConfig();
        this.level = config !== null && config !== void 0 ? config : LogLevel.DEBUG;
        if (process.env.NODE_ENV === 'production') {
            this.level = config !== null && config !== void 0 ? config : LogLevel.ERROR;
        }
    }
    shouldLog(level) {
        return level >= this.level;
    }
    formatMessage(...args) {
        return this.module ? [`[${this.module}]:`, ...args] : args;
    }
    debug(...args) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(...this.formatMessage(...args));
        }
    }
    log(...args) {
        if (this.shouldLog(LogLevel.LOG)) {
            console.log(...this.formatMessage(...args));
        }
    }
    warn(...args) {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(...this.formatMessage(...args));
        }
    }
    error(...args) {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(...this.formatMessage(...args));
        }
    }
}
exports.Logger = Logger;
const commonLogger = new Logger();
exports.commonLogger = commonLogger;
