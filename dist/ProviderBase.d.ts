import { CrossEventEmitter } from './CrossEventEmitter';
import { JsBridgeBase } from './JsBridgeBase';
import { IInjectedProviderNamesStrings, IJsonRpcResponse, ConsoleLike, IDebugLogger } from '@chargerwallet/cross-inpage-provider-types';
export type IBridgeRequestCallback = (error: Error | null, result?: IJsonRpcResponse<unknown>) => void;
export type IInpageProviderConfig = {
    bridge?: JsBridgeBase;
    logger?: ConsoleLike | null;
    maxEventListeners?: number;
};
export type DebugLoggerConfig = {
    config: string;
    enabledKeys: string[];
};
export type ConnectWalletInfo = {
    debugLoggerConfig?: DebugLoggerConfig;
    walletInfo?: {
        version?: 'string';
        name?: 'string';
    };
    providerState: unknown;
};
export type IProviderBaseConnectionStatus = 'connected' | 'disconnected';
declare abstract class ProviderBase extends CrossEventEmitter {
    constructor(config: IInpageProviderConfig);
    configDebugLogger(config: DebugLoggerConfig): void;
    getConnectWalletInfo({ timeout }?: {
        timeout?: number | undefined;
    }): Promise<ConnectWalletInfo | null>;
    version: string;
    isChargerWallet: boolean;
    protected abstract providerName: IInjectedProviderNamesStrings;
    protected readonly config: IInpageProviderConfig;
    readonly bridge: JsBridgeBase;
    debugLogger: IDebugLogger;
    readonly logger: ConsoleLike;
    bridgeRequest(data: unknown, callback?: IBridgeRequestCallback): Promise<unknown>;
    sendSiteMetadataDomReady(): void;
    sendSiteMetadata(): Promise<unknown>;
    connectionStatus?: IProviderBaseConnectionStatus;
    isConnectionStatusChanged(newStatus: IProviderBaseConnectionStatus): boolean;
    isAccountsChanged(...args: any[]): boolean;
    isNetworkChanged(...args: any[]): boolean;
}
export { ProviderBase };
