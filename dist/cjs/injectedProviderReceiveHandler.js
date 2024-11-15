"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectedProviderReceiveHandler = void 0;
const loggers_1 = require("./loggers");
function injectedProviderReceiveHandler(payload, bridge) {
    // ethereum, solana, conflux
    const providerHub = (bridge === null || bridge === void 0 ? void 0 : bridge.providersHub) || window.$chargerwallet;
    const providerName = payload.scope;
    const payloadData = payload.data;
    if (!providerName) {
        (0, loggers_1.consoleErrorInDev)('providerName (scope) is required in injectedProviderReceiveHandler.');
        return;
    }
    let providers = [];
    providers = providers.concat(providerHub[providerName]).filter(Boolean);
    if (!providers || !providers.length) {
        (0, loggers_1.consoleErrorInDev)(`[${providerName}] provider is NOT injected to document or bridge.`, payloadData);
        return;
    }
    // emit events to injected provider
    providers.forEach((provider) => {
        if (provider && provider.emit) {
            provider.emit('message_low_level', payloadData);
            provider.emit('message_payload_raw', payload);
        }
    });
    // $private custom provider receive handler
    if (providerName === '$private') {
        const privateProvider = providers[0];
        if (privateProvider && privateProvider.webembedReceiveHandler) {
            return privateProvider.webembedReceiveHandler(payload, bridge);
        }
    }
}
exports.injectedProviderReceiveHandler = injectedProviderReceiveHandler;
