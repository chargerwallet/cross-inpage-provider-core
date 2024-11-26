import { CrossEventEmitter } from './CrossEventEmitter';
import { IDebugLogger, IInjectedProviderNamesStrings, IJsBridgeConfig, IJsBridgeMessagePayload, IJsonRpcResponse } from '@onekeyfe/cross-inpage-provider-types';
declare function isLegacyExtMessage(payload: unknown): boolean;
declare abstract class JsBridgeBase extends CrossEventEmitter {
    constructor(config?: IJsBridgeConfig);
    private _requestPayloadCache;
    protected isExtUi: boolean;
    protected isInjected: boolean;
    protected sendAsString: boolean;
    globalOnMessageEnabled: boolean;
    providersHub: Record<string, any[]>;
    attachProviderInstance(provider: {
        providerName: string;
    }): void;
    private globalOnMessage;
    version: string;
    remoteInfo: {
        origin?: string;
        remoteId?: string | number | null;
    };
    private config;
    protected callbacksExpireTimeout: number;
    debugLogger: IDebugLogger;
    private callbacks;
    private callbackId;
    private createCallbackId;
    private createPayload;
    private send;
    rejectCallback(id: number | string, error: unknown): void;
    resolveCallback(id: number | string, data?: unknown): void;
    processCallback({ method, id, data, error, }: {
        method: 'resolve' | 'reject';
        id: number | string;
        data?: unknown;
        error?: unknown;
    }): void;
    rejectExpiredCallbacks(): void;
    clearCallbackCache(id: number | string): void;
    receive(payloadReceived?: string | IJsBridgeMessagePayload, sender?: {
        origin?: string;
        internal?: boolean;
    }): void;
    requestSync({ data, scope, remoteId, }: {
        data: unknown;
        scope?: IInjectedProviderNamesStrings;
        remoteId?: number | string | null;
    }): void;
    request(info: {
        data: unknown;
        remoteId?: number | string | null;
        scope?: IInjectedProviderNamesStrings;
    }): Promise<IJsonRpcResponse<unknown>> | undefined;
    response({ id, data, remoteId, scope, peerOrigin, }: {
        id: number;
        data: unknown;
        scope?: IInjectedProviderNamesStrings;
        remoteId?: number | string | null;
        peerOrigin?: string;
    }): void;
    responseError({ id, error, scope, remoteId, peerOrigin, }: {
        id: number;
        error: unknown;
        scope?: IInjectedProviderNamesStrings;
        remoteId?: number | string | null;
        peerOrigin?: string;
    }): void;
    abstract sendPayload(payload: IJsBridgeMessagePayload | string): void;
}
export { JsBridgeBase, isLegacyExtMessage };
