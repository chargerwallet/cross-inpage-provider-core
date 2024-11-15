var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment */
import { isFunction } from 'lodash-es';
import { CrossEventEmitter } from './CrossEventEmitter';
import siteMetadata from './siteMetadata';
import { fakeLogger, fakeDebugLogger, consoleErrorInDev } from './loggers';
import versionInfo from './versionInfo';
import { WALLET_INFO_LOACAL_KEY_V5 } from './consts';
const METHODS = {
    wallet_getConnectWalletInfo: 'wallet_getConnectWalletInfo',
    wallet_sendSiteMetadata: 'wallet_sendSiteMetadata',
};
class ProviderBase extends CrossEventEmitter {
    constructor(config) {
        var _a, _b, _c;
        super();
        this.version = versionInfo.version;
        this.isChargerWallet = true;
        this.debugLogger = fakeDebugLogger;
        this.logger = fakeLogger;
        if (!config.bridge) {
            throw new Error('ProviderBase init error: bridge required.');
        }
        this.config = config;
        this.bridge = config.bridge;
        this.logger = config.logger || fakeLogger;
        // TODO init this.debugLogger first, and enable debug config after extension connect
        this.debugLogger = ((_a = this.bridge) === null || _a === void 0 ? void 0 : _a.debugLogger) || fakeDebugLogger;
        (_c = (_b = this.bridge) === null || _b === void 0 ? void 0 : _b.debugLogger) === null || _c === void 0 ? void 0 : _c._attachExternalLogger(this.logger);
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this.bridge.attachProviderInstance(this);
        }, 0);
        // call sendSiteMetadataDomReady/getConnectWalletInfo in ProviderPrivate, dont need here
        // void this.sendSiteMetadataDomReady();
        // void this.getConnectWalletInfo();
    }
    configDebugLogger(config) {
        try {
            if (!config || !this.bridge.debugLogger) {
                return;
            }
            const debugLogger = this.bridge.debugLogger;
            (config.enabledKeys || []).forEach((key) => {
                debugLogger._createDebugInstance(key);
            });
            if (config.config) {
                debugLogger._debug.enable(config.config);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            window.$chargerwallet = window.$chargerwallet || {};
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            window.$chargerwallet.$debugLogger = debugLogger;
        }
        catch (error) {
            consoleErrorInDev('configDebugLogger ERROR:', error);
        }
    }
    getConnectWalletInfo({ timeout = 3000 } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line no-async-promise-executor,@typescript-eslint/no-misused-promises
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const timer = setTimeout(() => {
                    console.error(`getConnectWalletInfo timeout: ${timeout}`);
                    resolve(null);
                }, timeout);
                try {
                    const result = (yield this.bridgeRequest({
                        method: METHODS.wallet_getConnectWalletInfo,
                        params: [{ time: Date.now() }],
                    }));
                    if (result) {
                        result.providerState = result.providerState || {};
                    }
                    if (result && result.debugLoggerConfig) {
                        this.configDebugLogger(result.debugLoggerConfig);
                    }
                    if (result && result.walletInfo) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        window.$chargerwallet = window.$chargerwallet || {};
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        window.$chargerwallet.$walletInfo = result.walletInfo;
                        try {
                            localStorage.setItem(WALLET_INFO_LOACAL_KEY_V5, JSON.stringify(result.walletInfo));
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    if (result) {
                        resolve(result);
                    }
                    else {
                        console.error('getConnectWalletInfo error: result=null');
                        resolve(null);
                    }
                }
                catch (err) {
                    // TODO wallet not installed, timeout ERROR
                    consoleErrorInDev('getConnectWalletInfo: ERROR', err);
                    resolve(null);
                }
                finally {
                    clearTimeout(timer);
                }
            }));
        });
    }
    bridgeRequest(data, callback) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let hasCallback = false;
            if (callback && isFunction(callback)) {
                hasCallback = true;
            }
            try {
                const payload = {
                    data: data !== null && data !== void 0 ? data : {},
                    scope: this.providerName,
                };
                this.debugLogger.providerBase('bridgeRequest:', payload, '\r\n -----> ', payload.data);
                const resData = yield this.bridge.request(payload);
                if (resData) {
                    // @ts-ignore
                    resData.id = (_b = (_a = data === null || data === void 0 ? void 0 : data.id) !== null && _a !== void 0 ? _a : resData.id) !== null && _b !== void 0 ? _b : undefined;
                    // @ts-ignore
                    resData.jsonrpc = (_d = (_c = data === null || data === void 0 ? void 0 : data.jsonrpc) !== null && _c !== void 0 ? _c : resData.jsonrpc) !== null && _d !== void 0 ? _d : '2.0';
                }
                const result = resData ? resData.result : undefined;
                if (callback && hasCallback) {
                    // callback with params: { id, result, jsonrpc }
                    callback(null, resData);
                }
                this.debugLogger.providerBase('bridgeRequest RETURN:', { req: payload, res: resData }, '\r\n -----> ', payload.data, '\r\n -----> ', result);
                return result;
            }
            catch (error) {
                if (callback && hasCallback) {
                    callback(error);
                }
                throw error;
            }
        });
    }
    sendSiteMetadataDomReady() {
        if (document.readyState === 'complete') {
            void this.sendSiteMetadata();
        }
        else {
            const domContentLoadedHandler = () => {
                void this.sendSiteMetadata();
                window.removeEventListener('DOMContentLoaded', domContentLoadedHandler);
            };
            window.addEventListener('DOMContentLoaded', domContentLoadedHandler);
        }
    }
    sendSiteMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield siteMetadata.getSiteMetadata();
            return yield this.bridgeRequest({
                method: METHODS.wallet_sendSiteMetadata,
                params: metadata,
            });
        });
    }
    isConnectionStatusChanged(newStatus) {
        return this.connectionStatus === undefined || newStatus !== this.connectionStatus;
    }
    isAccountsChanged(...args) {
        throw new Error('isAccountsChanged not implemented');
    }
    isNetworkChanged(...args) {
        throw new Error('isNetworkChanged not implemented');
    }
}
export { ProviderBase };
