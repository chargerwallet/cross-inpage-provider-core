/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { WALLET_INFO_LOACAL_KEY_V5 } from './consts';
import { commonLogger } from './loggerConsole';
/**
 * An enumeration mapping specific blockchain provider names to their corresponding blockchain identifiers.
 *
 * These mappings are used to handle special cases where the provider name needs to be translated into a specific blockchain identifier for various operations.
 *
 */
export var ISpecialPropertyProviderNamesReflection;
(function (ISpecialPropertyProviderNamesReflection) {
    ISpecialPropertyProviderNamesReflection["btc"] = "unisat";
    ISpecialPropertyProviderNamesReflection["sui"] = "suiWallet";
    ISpecialPropertyProviderNamesReflection["polkadot"] = "polkadot-js";
})(ISpecialPropertyProviderNamesReflection || (ISpecialPropertyProviderNamesReflection = {}));
export var DEFINE_PROPERTY_WHITELIST = [
    'connectionStatus', // base provider
];
export function checkPlatformEnable(disablePlatform) {
    var _a, _b, _c, _d;
    var walletInfoLocalStr = localStorage.getItem(WALLET_INFO_LOACAL_KEY_V5);
    var walletInfoLocal = walletInfoLocalStr ? JSON.parse(walletInfoLocalStr) : null;
    if (!walletInfoLocal) {
        return true;
    }
    if (disablePlatform) {
        for (var _i = 0, disablePlatform_1 = disablePlatform; _i < disablePlatform_1.length; _i++) {
            var platform = disablePlatform_1[_i];
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
export function checkWalletSwitchEnable() {
    try {
        var walletInfoLocalStr = localStorage.getItem(WALLET_INFO_LOACAL_KEY_V5);
        var walletInfoLocal = walletInfoLocalStr ? JSON.parse(walletInfoLocalStr) : null;
        if (!walletInfoLocal) {
            return true;
        }
        if (!(walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.isDefaultWallet)) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('OneKey is not default wallet');
            }
            return false;
        }
        if (Array.isArray(walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.excludedDappList)) {
            var currentOrigin = window.location.origin;
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
        commonLogger.warn(e);
    }
    return true;
}
export function checkEnableDefineProperty(property) {
    if (property === '$onekey')
        return false;
    try {
        var walletInfoLocalStr = localStorage.getItem(WALLET_INFO_LOACAL_KEY_V5);
        var walletInfoLocal = walletInfoLocalStr ? JSON.parse(walletInfoLocalStr) : null;
        return !!(walletInfoLocal === null || walletInfoLocal === void 0 ? void 0 : walletInfoLocal.platformEnv.isExtension);
    }
    catch (e) {
        commonLogger.warn(e);
    }
    return false;
}
export function defineWindowProperty(property, provider, options) {
    var _a;
    if (!(options === null || options === void 0 ? void 0 : options.alwaysInject)) {
        if (!checkPlatformEnable(options === null || options === void 0 ? void 0 : options.disablePlatform))
            return;
        if (!checkWalletSwitchEnable())
            return;
    }
    var enable = checkEnableDefineProperty(property);
    var proxyProvider = new Proxy(provider, {
        defineProperty: function (target, property, attributes) {
            try {
                if (DEFINE_PROPERTY_WHITELIST.includes(property)) {
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
            Object.keys(provider).forEach(function (key) {
                var _a;
                ((_a = window[property]) !== null && _a !== void 0 ? _a : {})[key] = proxyProvider[key];
            });
            Object.defineProperty(window, property, {
                enumerable: (_a = options === null || options === void 0 ? void 0 : options.enumerable) !== null && _a !== void 0 ? _a : false, // Object.keys loop check inject
                configurable: false, // prevent redefined
                get: function () {
                    return proxyProvider;
                },
                set: function (val) {
                    // skip set
                },
            });
        }
        else {
            window[property] = provider;
        }
    }
    catch (ex) {
        commonLogger.error(ex);
        try {
            window[property] = provider;
        }
        catch (error) {
            commonLogger.warn(error);
        }
    }
}
