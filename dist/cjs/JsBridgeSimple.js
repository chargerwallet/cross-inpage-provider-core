"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsBridgeSimple = void 0;
const JsBridgeBase_1 = require("./JsBridgeBase");
class JsBridgeSimple extends JsBridgeBase_1.JsBridgeBase {
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
exports.JsBridgeSimple = JsBridgeSimple;
