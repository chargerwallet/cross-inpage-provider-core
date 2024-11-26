import { consoleErrorInDev } from './loggers';
function injectedProviderReceiveHandler(payload, bridge) {
    // ethereum, solana, conflux
    var providerHub = (bridge === null || bridge === void 0 ? void 0 : bridge.providersHub) || window.$onekey;
    var providerName = payload.scope;
    var payloadData = payload.data;
    if (!providerName) {
        consoleErrorInDev('providerName (scope) is required in injectedProviderReceiveHandler.');
        return;
    }
    var providers = [];
    providers = providers.concat(providerHub[providerName]).filter(Boolean);
    if (!providers || !providers.length) {
        consoleErrorInDev("[".concat(providerName, "] provider is NOT injected to document or bridge."), payloadData);
        return;
    }
    // emit events to injected provider
    providers.forEach(function (provider) {
        if (provider && provider.emit) {
            provider.emit('message_low_level', payloadData);
            provider.emit('message_payload_raw', payload);
        }
    });
    // $private custom provider receive handler
    if (providerName === '$private') {
        var privateProvider = providers[0];
        if (privateProvider && privateProvider.webembedReceiveHandler) {
            return privateProvider.webembedReceiveHandler(payload, bridge);
        }
    }
}
export { injectedProviderReceiveHandler };
