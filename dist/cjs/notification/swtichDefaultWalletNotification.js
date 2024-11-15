"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchDefaultWalletNotification = void 0;
const notification_1 = __importStar(require("./notification"));
const icon_1 = require("./icon");
let instance;
const switchDefaultWalletNotification = (isDefaultWallet) => {
    if ((0, notification_1.isInSameOriginIframe)()) {
        return;
    }
    if (instance) {
        instance.dismiss();
        instance = null;
    }
    const text = isDefaultWallet ? 'ChargerWallet is your default wallet now.' : 'ChargerWallet Default Canceled';
    instance = (0, notification_1.default)({
        dismissible: true,
        duration: 0,
        customClass: "chargerwallet-alert-default-wallet",
        content: `<div style="display: flex; align-items: center; gap: 8px;">
      <img style="width: 32px;" src="${icon_1.IconLogo}"/>
      <div>
        <div style="color: rgba(0, 0, 0, 0.88); font-size: 13px;"><span style="line-height: 19px; font-weight: ${isDefaultWallet ? '500' : '700'};">${text}</span></div>
        <div style="font-size: 13px; line-height: 18px; color: rgba(0, 0, 0, 0.61);">
        Please <a
          href="javascript:window.location.reload();"
          style="color: #0091FF; text-decoration: underline;">refresh the web page</a> 
        and retry
        </div>
      </div>
    </div>
    `,
    });
};
exports.switchDefaultWalletNotification = switchDefaultWalletNotification;
