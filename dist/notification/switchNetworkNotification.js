import notification, { isInSameOriginIframe } from "./notification";
import { IconLogo } from './icon';
var instance;
export var switchNetworkNotification = function (networkChangedText) {
    if (isInSameOriginIframe()) {
        return;
    }
    if (instance) {
        instance.dismiss();
        instance = null;
    }
    instance = notification({
        dismissible: false,
        duration: 1500,
        customClass: "onekey-alert-network-changed",
        content: "<div style=\"display: flex; align-items: center; gap: 8px;\">\n      <img style=\"width: 32px;\" src=\"".concat(IconLogo, "\"/>\n      <div>\n        <div style=\"color: rgba(0, 0, 0, 0.88); font-size: 13px;\"><span style=\"line-height: 19px; font-weight: 500;\">").concat(networkChangedText, "</span></div>\n      </div>\n    </div>\n    "),
    });
};
