import { IJsBridgeMessagePayload } from 'cross-inpage-provider-types';
import { JsBridgeBase } from './JsBridgeBase';
declare function injectedProviderReceiveHandler(payload: IJsBridgeMessagePayload, bridge?: JsBridgeBase): unknown;
export { injectedProviderReceiveHandler };
