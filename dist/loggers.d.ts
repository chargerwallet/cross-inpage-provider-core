import { IDebugLogger, ConsoleLike } from 'cross-inpage-provider-types';
declare function consoleErrorInDev(...args: unknown[]): void;
declare const fakeLogger: ConsoleLike;
declare const fakeDebugLogger: IDebugLogger;
declare const appDebugLogger: IDebugLogger;
export { fakeDebugLogger, appDebugLogger, fakeLogger, consoleErrorInDev };
