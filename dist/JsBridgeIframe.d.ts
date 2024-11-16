import { IJsBridgeConfig, IJsBridgeMessagePayload, IPostMessageEventData, IOptionsWithDebugLogger } from '@chargerwallet/cross-inpage-provider-types';
import { JsBridgeBase } from './JsBridgeBase';
export type ISetupPostMessageListenerOptions = IOptionsWithDebugLogger & {
    bridge?: JsBridgeIframe;
    origin?: string;
};
export type IPostMessageEventDataIframe = IPostMessageEventData & {
    frameName: string;
};
/**
 * When the JsBridgeIframe instance changes, the tag can be changed manually
 */
declare function setPostMessageListenerFlag(value: boolean): void;
export type IJsBridgeIframeConfig = IJsBridgeConfig & {
    remoteFrame: Window;
    selfFrameName: string;
    remoteFrameName: string;
    channel: string;
    targetOrigin?: string;
};
declare class JsBridgeIframe extends JsBridgeBase {
    targetOrigin: string;
    constructor(config: IJsBridgeIframeConfig);
    bridgeConfig: IJsBridgeIframeConfig;
    sendAsString: boolean;
    isInjected: boolean;
    sendPayload(payloadObj: IJsBridgeMessagePayload | string): void;
}
export { JsBridgeIframe, setPostMessageListenerFlag };
