import { IJsBridgeMessagePayload } from 'cross-inpage-provider-types';
import { JsBridgeBase } from './JsBridgeBase';
declare class JsBridgeSimple extends JsBridgeBase {
    sendAsString: boolean;
    isInjected: boolean;
    private remote;
    callbacksExpireTimeout: number;
    sendPayload(payload: IJsBridgeMessagePayload | string): void;
    setRemote(remote: JsBridgeBase): void;
}
export { JsBridgeSimple };
