"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineWindowProperty = exports.checkEnableDefineProperty = exports.checkWalletSwitchEnable = exports.checkPlatformEnable = exports.DEFINE_PROPERTY_WHITELIST = exports.ISpecialPropertyProviderNamesReflection = void 0;
const consts_1 = require("./consts");
const loggerConsole_1 = require("./loggerConsole");
/**
 * An enumeration mapping specific blockchain provider names to their corresponding blockchain identifiers.
 *
 * These mappings are used to handle special cases where the provider name needs to be translated into a specific blockchain identifier for various operations.
 *
 */
var ISpecialPropertyProviderNamesReflection;
(function (ISpecialPropertyProviderNamesReflection) {
    ISpecialPropertyProviderNamesReflection["btc"] = "unisat";
    ISpecialPropertyProviderNamesReflection["sui"] = "suiWallet";
    ISpecialPropertyProviderNamesReflection["polkadot"] = "polkadot-js";
})(ISpecialPropertyProviderNamesReflection = exports.ISpecialPropertyProviderNamesReflection || (exports.ISpecialPropertyProviderNamesReflection = {}));
exports.DEFINE_PROPERTY_WHITELIST = [
    'connectionStatus', // base provider
];
function checkPlatformEnable(disablePlatform) {
    var _a, _b, _c, _d;
    const walletInfoLocalStr = localStorage.getItem(consts_1.WALLET_INFO_LOACAL_KEY_V5);
    const walletInfoLocal = walletInfoLocalStr ? JSON.parse(walletInfoLocalStr) : null;
    if (!walletInfoLocal) {
        return true;
    }
    if (disablePlatform) {
        for (const platform of disablePlatform) {
            if (platform === 'web' && ((_a = walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.platformEnv) === null || _a === void 0 ? void 0 : _a.isWeb)) {
                return false;
            }
            if (platform === 'desktop' && ((_b = walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.platformEnv) === null || _b === void 0 ? void 0 : _b.isDesktop)) {
                return false;
            }
            if (platform === 'extension' && ((_c = walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.platformEnv) === null || _c === void 0 ? void 0 : _c.isExtension)) {
                return false;
            }
            if (platform === 'native' && ((_d = walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.platformEnv) === null || _d === void 0 ? void 0 : _d.isNative)) {
                return false;
            }
        }
    }
    return true;
}
exports.checkPlatformEnable = checkPlatformEnable;
function checkWalletSwitchEnable() {
    try {
        const walletInfoLocalStr = localStorage.getItem(consts_1.WALLET_INFO_LOACAL_KEY_V5);
        const walletInfoLocal = walletInfoLocalStr ? JSON.parse(walletInfoLocalStr) : null;
        if (!walletInfoLocal) {
            return true;
        }
        if (!(walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.isDefaultWallet)) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('ChargerWallet is not default wallet');
            }
            return false;
        }
        if (Array.isArray(walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.excludedDappList)) {
            const currentOrigin = window.location.origin;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (walletInfoLocal.excludedDappList.includes(currentOrigin)) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('skip inject web3 provider: ', currentOrigin);
                }
                return false;
            }
        }
        return true;
    }
    catch (e) {
        loggerConsole_1.commonLogger.warn(e);
    }
    return true;
}
exports.checkWalletSwitchEnable = checkWalletSwitchEnable;
function checkEnableDefineProperty(property) {
    if (property === '$chargerwallet')
        return false;
    try {
        const walletInfoLocalStr = localStorage.getItem(consts_1.WALLET_INFO_LOACAL_KEY_V5);
        const walletInfoLocal = walletInfoLocalStr ? JSON.parse(walletInfoLocalStr) : null;
        return !!(walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.platformEnv.isExtension);
    }
    catch (e) {
        loggerConsole_1.commonLogger.warn(e);
    }
    return false;
}
exports.checkEnableDefineProperty = checkEnableDefineProperty;
function defineWindowProperty(property, provider, options) {
    var _a;
    if (!(options === null || options === void 0 ? void 0 : options.alwaysInject)) {
        if (!checkPlatformEnable(options === null || options === void 0 ? void 0 : options.disablePlatform))
            return;
        if (!checkWalletSwitchEnable())
            return;
    }
    const enable = checkEnableDefineProperty(property);
    const proxyProvider = new Proxy(provider, {
        defineProperty(target, property, attributes) {
            try {
                if (exports.DEFINE_PROPERTY_WHITELIST.includes(property)) {
                    return Reflect.defineProperty(target, property, attributes);
                }
            }
            catch (error) {
                // ignore error
            }
            return true;
        },
    });
    try {
        if (enable) {
            Object.keys(provider).forEach((key) => {
                var _a;
                ((_a = window[property]) !== null && _a !== void 0 ? _a : {})[key] = proxyProvider[key];
            });
            Object.defineProperty(window, property, {
                enumerable: (_a = options === null || options === void 0 ? void 0 : options.enumerable) !== null && _a !== void 0 ? _a : false,
                configurable: false,
                get() {
                    return proxyProvider;
                },
                set(val) {
                    // skip set
                },
            });
        }
        else {
            window[property] = provider;
        }
    }
    catch (ex) {
        loggerConsole_1.commonLogger.error(ex);
        try {
            window[property] = provider;
        }
        catch (error) {
            loggerConsole_1.commonLogger.warn(error);
        }
    }
}
exports.defineWindowProperty = defineWindowProperty;
