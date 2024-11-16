"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLegacyExtMessage = exports.JsBridgeBase = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const lodash_es_1 = require("lodash-es");
const CrossEventEmitter_1 = require("./CrossEventEmitter");
const loggers_1 = require("./loggers");
const cross_inpage_provider_errors_1 = require("@chargerwallet/cross-inpage-provider-errors");
const cross_inpage_provider_types_1 = require("@chargerwallet/cross-inpage-provider-types");
const versionInfo_1 = __importDefault(require("./versionInfo"));
function toPlainError(errorInfo) {
    return {
        name: errorInfo.name,
        message: errorInfo.message,
        stack: errorInfo.stack,
        code: errorInfo.code,
        data: errorInfo.data,
        key: errorInfo.key,
        info: errorInfo.info,
        className: errorInfo.className,
        autoToast: errorInfo.autoToast,
        requestId: errorInfo.requestId,
    };
}
function isLegacyExtMessage(payload) {
    const payloadObj = payload;
    return (Boolean(payloadObj.name) &&
        ['chargerwallet-provider-eth', 'chargerwallet-provider-cfx', 'publicConfig'].includes(payloadObj.name));
}
exports.isLegacyExtMessage = isLegacyExtMessage;
const globalWindow = typeof window !== 'undefined' ? window : global;
const BRIDGE_EVENTS = {
    message: 'message',
    error: 'error',
};
class JsBridgeBase extends CrossEventEmitter_1.CrossEventEmitter {
    constructor(config = {}) {
        var _a, _b;
        super();
        this._requestPayloadCache = {};
        this.isExtUi = false;
        this.isInjected = false;
        this.sendAsString = true;
        this.globalOnMessageEnabled = true;
        this.providersHub = {
        // name: []
        };
        // Only handle type=REQUEST messages, type=RESPONSE message will be ignored
        this.globalOnMessage = (message) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.config.receiveHandler && this.globalOnMessageEnabled) {
                    const returnValue = yield this.config.receiveHandler(message, this);
                    if (message.id) {
                        this.response({
                            id: message.id,
                            scope: message.scope,
                            remoteId: message.remoteId,
                            data: returnValue,
                            peerOrigin: message.origin,
                        });
                    }
                }
            }
            catch (error) {
                if (message.id && message.type === cross_inpage_provider_types_1.IJsBridgeMessageTypes.REQUEST) {
                    this.responseError({
                        id: message.id,
                        scope: message.scope,
                        remoteId: message.remoteId,
                        error,
                        peerOrigin: message.origin,
                    });
                }
                this.emit(BRIDGE_EVENTS.error, error);
            }
            finally {
                // noop
            }
        });
        this.version = versionInfo_1.default.version;
        this.remoteInfo = {
            origin: '',
            remoteId: '',
        };
        // TODO increase timeout as hardware sign transaction may take a long time
        //    can set timeout for each callback
        this.callbacksExpireTimeout = 10 * 60 * 1000;
        this.debugLogger = loggers_1.appDebugLogger;
        this.callbacks = [];
        this.callbackId = 1;
        this.config = config;
        this.callbacksExpireTimeout = (_a = config.timeout) !== null && _a !== void 0 ? _a : this.callbacksExpireTimeout;
        this.debugLogger = config.debugLogger || loggers_1.appDebugLogger;
        this.sendAsString = (_b = config.sendAsString) !== null && _b !== void 0 ? _b : this.sendAsString;
        if (this.config.receiveHandler) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.on(BRIDGE_EVENTS.message, this.globalOnMessage);
        }
        this.on(BRIDGE_EVENTS.error, (error) => {
            (0, loggers_1.consoleErrorInDev)('JsBridge ERROR: ', error, {
                code: error === null || error === void 0 ? void 0 : error.code,
            });
        });
        this.rejectExpiredCallbacks();
    }
    attachProviderInstance(provider) {
        var _a;
        const name = provider.providerName;
        if (name) {
            this.providersHub[name] = (_a = this.providersHub[name]) !== null && _a !== void 0 ? _a : [];
            this.providersHub[name].push(provider);
        }
    }
    createCallbackId() {
        this.callbackId += 1;
        return this.callbackId;
    }
    createPayload(payload, { resolve, reject, }) {
        const { id, type } = payload;
        if (resolve && reject && id && type === cross_inpage_provider_types_1.IJsBridgeMessageTypes.REQUEST) {
            if (this.callbacks[id]) {
                // TODO custom error
                throw new Error(`JsBridge ERROR: callback exists, id=${id}`);
            }
            this.callbacks[id] = { id, resolve, reject, created: Date.now() };
        }
        // convert to plain error object which can be stringify
        if (payload.error) {
            const errorInfo = payload.error;
            payload.error = toPlainError(errorInfo);
        }
        // delete resolve, reject function which can not be send as string
        payload === null || payload === void 0 ? true : delete payload.resolve;
        payload === null || payload === void 0 ? true : delete payload.reject;
        return payload;
    }
    send({ type, data, error, id, remoteId, sync = false, scope, peerOrigin, }) {
        const executor = (resolve, reject) => {
            var _a, _b, _c;
            // TODO check resolve when calling without await
            // eslint-disable-next-line @typescript-eslint/naming-convention
            let _id = id;
            // sendSync without Promise cache
            if (!sync && type === cross_inpage_provider_types_1.IJsBridgeMessageTypes.REQUEST) {
                _id = this.createCallbackId();
            }
            try {
                const payload = this.createPayload({
                    id: _id,
                    data,
                    error,
                    type,
                    origin: ((_a = globalWindow === null || globalWindow === void 0 ? void 0 : globalWindow.location) === null || _a === void 0 ? void 0 : _a.origin) || '',
                    peerOrigin,
                    remoteId,
                    scope,
                }, { resolve, reject });
                let payloadToSend = payload;
                if (this.sendAsString) {
                    payloadToSend = JSON.stringify(payload);
                }
                // @ts-ignore
                if ((_b = this.debugLogger.jsBridge) === null || _b === void 0 ? void 0 : _b.enabled) {
                    if (payload && payload.id && payload.type === cross_inpage_provider_types_1.IJsBridgeMessageTypes.REQUEST) {
                        this._requestPayloadCache[payload.id] = payload;
                        if (payload.id % 100 === 0) {
                            this._requestPayloadCache = {};
                        }
                    }
                }
                this.debugLogger.jsBridge('send', payload, '\r\n ------> ', payload.data, '\r\n ------> ', 
                // @ts-ignore
                (_c = payload.data) === null || _c === void 0 ? void 0 : _c.result);
                this.sendPayload(payloadToSend);
            }
            catch (error) {
                if (_id) {
                    this.rejectCallback(_id, error);
                }
                else {
                    this.emit(BRIDGE_EVENTS.error, error);
                }
            }
        };
        if (sync) {
            executor();
            void 0;
        }
        else {
            return new Promise(executor);
        }
    }
    rejectCallback(id, error) {
        this.processCallback({
            method: 'reject',
            id,
            error,
        });
    }
    resolveCallback(id, data) {
        this.processCallback({
            method: 'resolve',
            id,
            data,
        });
    }
    processCallback({ method, id, data, error, }) {
        const callbackInfo = this.callbacks[id];
        if (callbackInfo) {
            if (method === 'reject') {
                if (callbackInfo.reject) {
                    callbackInfo.reject(error);
                }
                this.emit(BRIDGE_EVENTS.error, error);
            }
            if (method === 'resolve') {
                if (callbackInfo.resolve) {
                    callbackInfo.resolve(data);
                }
            }
            this.clearCallbackCache(id);
        }
    }
    rejectExpiredCallbacks() {
        if (!this.callbacksExpireTimeout) {
            return;
        }
        const now = Date.now();
        const callbacksLength = this.callbacks.length;
        for (let id = 0; id < callbacksLength; id++) {
            const callbackInfo = this.callbacks[id];
            if (callbackInfo && callbackInfo.created) {
                if (now - callbackInfo.created > this.callbacksExpireTimeout) {
                    const error = cross_inpage_provider_errors_1.web3Errors.provider.requestTimeout();
                    this.rejectCallback(id, error);
                }
            }
        }
        setTimeout(() => {
            this.rejectExpiredCallbacks();
        }, this.callbacksExpireTimeout);
    }
    clearCallbackCache(id) {
        delete this.callbacks[id];
    }
    receive(payloadReceived = '', sender) {
        var _a, _b, _c, _d, _e;
        let payload = {
            data: null,
        };
        if ((0, lodash_es_1.isPlainObject)(payloadReceived)) {
            payload = payloadReceived;
        }
        if ((0, lodash_es_1.isString)(payloadReceived)) {
            try {
                payload = JSON.parse(payloadReceived);
            }
            catch (error) {
                this.emit(BRIDGE_EVENTS.error, error);
                throw new Error('JsBridge ERROR: JSON.parse payloadReceived failed');
            }
        }
        // !IMPORTANT: force overwrite origin and internal field
        //    DO NOT trust dapp params
        payload.origin = sender === null || sender === void 0 ? void 0 : sender.origin;
        payload.internal = Boolean(sender === null || sender === void 0 ? void 0 : sender.internal);
        // ignore legacy Ext publicConfig message
        if ((sender === null || sender === void 0 ? void 0 : sender.internal) && this.isExtUi && isLegacyExtMessage(payload)) {
            return;
        }
        if (!payload.origin && !this.isInjected) {
            (0, loggers_1.consoleErrorInDev)((_a = this === null || this === void 0 ? void 0 : this.constructor) === null || _a === void 0 ? void 0 : _a.name, '[payload.origin] is missing.', this);
            throw new Error('JsBridge ERROR: receive message [payload.origin] is required.');
        }
        if (!payload.internal && !payload.scope) {
            throw new Error('JsBridge ERROR: receive message [payload.scope] is required for non-internal method call.');
        }
        const relatedSendPayload = (_c = this._requestPayloadCache[(_b = payload === null || payload === void 0 ? void 0 : payload.id) !== null && _b !== void 0 ? _b : '']) !== null && _c !== void 0 ? _c : null;
        this.debugLogger.jsBridge('receive', payload, { sender }, '\r\n -----> ', (_e = (_d = payload.data) === null || _d === void 0 ? void 0 : _d.result) !== null && _e !== void 0 ? _e : payload.data, '\r\n <----- ', relatedSendPayload === null || relatedSendPayload === void 0 ? void 0 : relatedSendPayload.data);
        const { type, id, data, error, origin, remoteId } = payload;
        this.remoteInfo = {
            origin,
            remoteId,
        };
        if (type === cross_inpage_provider_types_1.IJsBridgeMessageTypes.RESPONSE) {
            if (id === undefined || id === null) {
                throw new Error('JsBridge ERROR: parameter [id] is required in JsBridge.receive() when REQUEST type message');
            }
            const callbackInfo = this.callbacks[id];
            if (callbackInfo) {
                try {
                    if (error) {
                        this.rejectCallback(id, error);
                    }
                    else {
                        this.resolveCallback(id, data);
                    }
                }
                catch (error0) {
                    this.emit(BRIDGE_EVENTS.error, error0);
                }
                finally {
                    // noop
                }
            }
        }
        else if (type === cross_inpage_provider_types_1.IJsBridgeMessageTypes.REQUEST) {
            const eventMessagePayload = Object.assign(Object.assign({}, payload), { created: Date.now() });
            // https://nodejs.org/api/events.html#capture-rejections-of-promises
            // only type=REQUEST message will be handled by globalOnMessage
            this.emit(BRIDGE_EVENTS.message, eventMessagePayload);
        }
        else {
            throw new Error(`JsBridge ERROR: payload type not support yet (type=${type || 'undefined'})`);
        }
    }
    requestSync({ data, scope, remoteId, }) {
        void this.send({
            id: undefined,
            type: cross_inpage_provider_types_1.IJsBridgeMessageTypes.REQUEST,
            scope,
            data,
            remoteId,
            sync: true,
        });
    }
    request(info) {
        const { data, remoteId, scope } = info;
        if (data === undefined) {
            console.warn('JsBridge ERROR: data required. Call like `bridge.request({ data: {...} });`');
        }
        return this.send({
            type: cross_inpage_provider_types_1.IJsBridgeMessageTypes.REQUEST,
            data,
            remoteId,
            sync: false,
            scope,
        });
    }
    // send response DATA to remote
    response({ id, data, remoteId, scope, peerOrigin, }) {
        void this.send({
            type: cross_inpage_provider_types_1.IJsBridgeMessageTypes.RESPONSE,
            data,
            id,
            remoteId,
            scope,
            sync: true,
            peerOrigin,
        });
    }
    // send response ERROR to remote
    responseError({ id, error, scope, remoteId, peerOrigin, }) {
        void this.send({
            type: cross_inpage_provider_types_1.IJsBridgeMessageTypes.RESPONSE,
            error,
            id,
            remoteId,
            scope,
            sync: true,
            peerOrigin,
        });
    }
}
exports.JsBridgeBase = JsBridgeBase;
