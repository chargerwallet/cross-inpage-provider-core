import notification, { isInSameOriginIframe } from "./notification";
import { IconLogo } from './icon';
var instance;
export var switchDefaultWalletNotification = function (isDefaultWallet) {
    if (isInSameOriginIframe()) {
        return;
    }
    if (instance) {
        instance.dismiss();
        instance = null;
    }
    var text = isDefaultWallet ? 'OneKey is your default wallet now.' : 'OneKey Default Canceled';
    instance = notification({
        dismissible: true,
        duration: 0,
        customClass: "onekey-alert-default-wallet",
        content: "<div style=\"display: flex; align-items: center; gap: 8px;\">\n      <img style=\"width: 32px;\" src=\"".concat(IconLogo, "\"/>\n      <div>\n        <div style=\"color: rgba(0, 0, 0, 0.88); font-size: 13px;\"><span style=\"line-height: 19px; font-weight: ").concat(isDefaultWallet ? '500' : '700', ";\">").concat(text, "</span></div>\n        <div style=\"font-size: 13px; line-height: 18px; color: rgba(0, 0, 0, 0.61);\">\n        Please <a\n          href=\"javascript:window.location.reload();\"\n          style=\"color: #0091FF; text-decoration: underline;\">refresh the web page</a> \n        and retry\n        </div>\n      </div>\n    </div>\n    "),
    });
};
