import { JsBridgeBase } from './JsBridgeBase';
declare function injectJsBridge(bridgeCreator: () => JsBridgeBase | unknown): JsBridgeBase;
export { injectJsBridge };
