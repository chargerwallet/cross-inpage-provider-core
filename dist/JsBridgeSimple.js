import { JsBridgeBase } from './JsBridgeBase';
class JsBridgeSimple extends JsBridgeBase {
    constructor() {
        super(...arguments);
        this.sendAsString = true;
        this.isInjected = true;
        this.remote = null;
        this.callbacksExpireTimeout = 0;
    }
    sendPayload(payload) {
        if (!this.remote) {
            throw new Error('JsBridgeSimple ERROR: remote not set.');
        }
        this.remote.receive(payload);
    }
    setRemote(remote) {
        this.remote = remote;
    }
}
export { JsBridgeSimple };
