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
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment,  @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
 */
// @ts-ignore
import EventEmitterBase from '@onekeyfe/cross-inpage-provider-events';
function safeApply(handler, context, args) {
    try {
        Reflect.apply(handler, context, args);
    }
    catch (err) {
        // Throw error after timeout so as not to interrupt the stack
        setTimeout(function () {
            throw err;
        });
    }
}
function arrayClone(arr) {
    var n = arr.length;
    var copy = new Array(n);
    for (var i = 0; i < n; i += 1) {
        copy[i] = arr[i];
    }
    return copy;
}
var EventEmitterProxy = /** @class */ (function (_super) {
    __extends(EventEmitterProxy, _super);
    function EventEmitterProxy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventEmitterProxy.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArray([eventName], args, false));
    };
    EventEmitterProxy.prototype.addListener = function (eventName, listener) {
        _super.prototype.addListener.call(this, eventName, listener);
        return this;
    };
    EventEmitterProxy.prototype.on = function (eventName, listener) {
        _super.prototype.on.call(this, eventName, listener);
        return this;
    };
    EventEmitterProxy.prototype.once = function (eventName, listener) {
        _super.prototype.once.call(this, eventName, listener);
        return this;
    };
    EventEmitterProxy.prototype.removeListener = function (eventName, listener) {
        _super.prototype.removeListener.call(this, eventName, listener);
        return this;
    };
    EventEmitterProxy.prototype.off = function (eventName, listener) {
        _super.prototype.off.call(this, eventName, listener);
        return this;
    };
    EventEmitterProxy.prototype.removeAllListeners = function (event) {
        _super.prototype.removeAllListeners.call(this, event);
        return this;
    };
    EventEmitterProxy.prototype.setMaxListeners = function (n) {
        _super.prototype.setMaxListeners.call(this, n);
        return this;
    };
    EventEmitterProxy.prototype.getMaxListeners = function () {
        return _super.prototype.getMaxListeners.call(this);
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    EventEmitterProxy.prototype.listeners = function (eventName) {
        return _super.prototype.listeners.call(this, eventName);
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    EventEmitterProxy.prototype.rawListeners = function (eventName) {
        return _super.prototype.rawListeners.call(this, eventName);
    };
    EventEmitterProxy.prototype.listenerCount = function (eventName) {
        return _super.prototype.listenerCount.call(this, eventName);
    };
    EventEmitterProxy.prototype.prependListener = function (eventName, listener) {
        _super.prototype.prependListener.call(this, eventName, listener);
        return this;
    };
    EventEmitterProxy.prototype.prependOnceListener = function (eventName, listener) {
        _super.prototype.prependOnceListener.call(this, eventName, listener);
        return this;
    };
    EventEmitterProxy.prototype.eventNames = function () {
        return _super.prototype.eventNames.call(this);
    };
    return EventEmitterProxy;
}(EventEmitterBase));
var CrossEventEmitter = /** @class */ (function (_super) {
    __extends(CrossEventEmitter, _super);
    function CrossEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CrossEventEmitter.prototype.emit = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var doError = type === 'error';
        var events = this._events;
        if (events !== undefined) {
            doError = doError && events.error === undefined;
        }
        else if (!doError) {
            return false;
        }
        // If there is no 'error' event listener then throw.
        if (doError) {
            var er = void 0;
            if (args.length > 0) {
                er = args[0];
            }
            if (er instanceof Error) {
                // Note: The comments on the `throw` lines are intentional, they show
                // up in Node's output if this results in an unhandled exception.
                throw er; // Unhandled 'error' event
            }
            // At least give some kind of context to the user
            var err = new Error("Unhandled error.".concat(er ? " (".concat(er.message, ")") : ''));
            err.context = er;
            throw err; // Unhandled 'error' event
        }
        var handler = events[type];
        if (handler === undefined) {
            return false;
        }
        if (typeof handler === 'function') {
            safeApply(handler, this, args);
        }
        else {
            var len = handler.length;
            var listeners = arrayClone(handler);
            for (var i = 0; i < len; i += 1) {
                safeApply(listeners[i], this, args);
            }
        }
        return true;
    };
    return CrossEventEmitter;
}(EventEmitterProxy));
export { CrossEventEmitter };
