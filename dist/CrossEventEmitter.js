/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment,  @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
 */
// @ts-ignore
import EventEmitterBase from 'cross-inpage-provider-events';
function safeApply(handler, context, args) {
    try {
        Reflect.apply(handler, context, args);
    }
    catch (err) {
        // Throw error after timeout so as not to interrupt the stack
        setTimeout(() => {
            throw err;
        });
    }
}
function arrayClone(arr) {
    const n = arr.length;
    const copy = new Array(n);
    for (let i = 0; i < n; i += 1) {
        copy[i] = arr[i];
    }
    return copy;
}
class EventEmitterProxy extends EventEmitterBase {
    emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    addListener(eventName, listener) {
        super.addListener(eventName, listener);
        return this;
    }
    on(eventName, listener) {
        super.on(eventName, listener);
        return this;
    }
    once(eventName, listener) {
        super.once(eventName, listener);
        return this;
    }
    removeListener(eventName, listener) {
        super.removeListener(eventName, listener);
        return this;
    }
    off(eventName, listener) {
        super.off(eventName, listener);
        return this;
    }
    removeAllListeners(event) {
        super.removeAllListeners(event);
        return this;
    }
    setMaxListeners(n) {
        super.setMaxListeners(n);
        return this;
    }
    getMaxListeners() {
        return super.getMaxListeners();
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    listeners(eventName) {
        return super.listeners(eventName);
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    rawListeners(eventName) {
        return super.rawListeners(eventName);
    }
    listenerCount(eventName) {
        return super.listenerCount(eventName);
    }
    prependListener(eventName, listener) {
        super.prependListener(eventName, listener);
        return this;
    }
    prependOnceListener(eventName, listener) {
        super.prependOnceListener(eventName, listener);
        return this;
    }
    eventNames() {
        return super.eventNames();
    }
}
class CrossEventEmitter extends EventEmitterProxy {
    emit(type, ...args) {
        let doError = type === 'error';
        const events = this._events;
        if (events !== undefined) {
            doError = doError && events.error === undefined;
        }
        else if (!doError) {
            return false;
        }
        // If there is no 'error' event listener then throw.
        if (doError) {
            let er;
            if (args.length > 0) {
                [er] = args;
            }
            if (er instanceof Error) {
                // Note: The comments on the `throw` lines are intentional, they show
                // up in Node's output if this results in an unhandled exception.
                throw er; // Unhandled 'error' event
            }
            // At least give some kind of context to the user
            const err = new Error(`Unhandled error.${er ? ` (${er.message})` : ''}`);
            err.context = er;
            throw err; // Unhandled 'error' event
        }
        const handler = events[type];
        if (handler === undefined) {
            return false;
        }
        if (typeof handler === 'function') {
            safeApply(handler, this, args);
        }
        else {
            const len = handler.length;
            const listeners = arrayClone(handler);
            for (let i = 0; i < len; i += 1) {
                safeApply(listeners[i], this, args);
            }
        }
        return true;
    }
}
export { CrossEventEmitter };
