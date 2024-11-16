/// <reference types="node" />
import EventEmitterBase from '@chargerwallet/cross-inpage-provider-events';
import type { EventEmitter as INodeEventEmitter } from 'events';
declare class EventEmitterProxy extends EventEmitterBase implements INodeEventEmitter {
    emit(eventName: string | symbol, ...args: any[]): boolean;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(eventName: string | symbol): Function[];
    rawListeners(eventName: string | symbol): Function[];
    listenerCount(eventName: string | symbol): number;
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    eventNames(): (string | symbol)[];
}
declare class CrossEventEmitter extends EventEmitterProxy {
    emit(type: string, ...args: any[]): boolean;
}
export { CrossEventEmitter };
