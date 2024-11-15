declare enum LogLevel {
    DEBUG = 0,
    LOG = 1,
    WARN = 2,
    ERROR = 3
}
declare function setStoredLogConfig(config: LogLevel): void;
declare class Logger {
    private module?;
    private level;
    constructor(module?: string | null);
    private shouldLog;
    private formatMessage;
    debug(...args: unknown[]): void;
    log(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
}
declare const commonLogger: Logger;
export { Logger, LogLevel, commonLogger, setStoredLogConfig };
