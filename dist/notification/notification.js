/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconDismiss } from './icon';
var Notification = /** @class */ (function () {
    function Notification(settings) {
        this.settings = settings;
        this.element = document.createElement("div");
        this.element.className = "onekey-alert-message ".concat(this.settings.customClass ? this.settings.customClass : "");
        // initialize event handlers
        this.eventHandlers = {};
        // add inner content
        this.insert();
        // start auto-dismiss timer
        if (this.settings.duration) {
            this.initiateTimer();
        }
        // mouse interaction events
        this.bindEvents();
    }
    Notification.prototype.insert = function () {
        var _a;
        if (!this.element) {
            return;
        }
        // content container
        var contentContainer = document.createElement("div");
        contentContainer.className = "onekey-alert-message-body";
        contentContainer.innerHTML = this.settings.content;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.appendChild(contentContainer);
        // dismiss button
        if (this.settings.dismissible) {
            this.dismissButton = document.createElement("div");
            this.dismissButton.className = "onekey-alert-message-dismiss";
            var dismissIcon = document.createElement("img");
            dismissIcon.setAttribute("src", IconDismiss);
            dismissIcon.className = "onekey-alert-close-icon";
            this.dismissButton.appendChild(dismissIcon);
            this.element.appendChild(this.dismissButton);
        }
        this.settings.hostElement.appendChild(this.element);
    };
    Notification.prototype.bindEvents = function () {
        var _this = this;
        var _a;
        this.eventHandlers.dismiss = function () { return _this.dismiss(); };
        (_a = this.dismissButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.eventHandlers.dismiss, false);
    };
    Notification.prototype.initiateTimer = function (duration) {
        var _this = this;
        if (duration === void 0) { duration = this.settings.duration; }
        this.dismissalTimer = setTimeout(function () {
            _this.dismiss();
        }, duration);
    };
    Notification.prototype.cancelTimer = function () {
        if (this.dismissalTimer) {
            clearTimeout(this.dismissalTimer);
            this.dismissalTimer = null;
        }
    };
    Notification.prototype.dismiss = function () {
        if (!this.element) {
            return;
        }
        this.element.classList.add(".onekey-alert-message-hidden");
        this.settings.hostElement.removeChild(this.element);
        this.element = null;
        if (this.settings.onDismiss) {
            this.settings.onDismiss();
        }
        this.cancelTimer();
    };
    return Notification;
}());
var container = null;
var style = null;
var styles = "\n    .onekey-alert-container {\n      position: fixed;\n      z-index: 99999;\n      top: 60px;\n      right: 42px;\n    }\n    .onekey-alert-message {\n      min-width: 230px;\n      min-height: 44px;\n      background: #FFFFFF;\n      border: 1px solid rgba(0, 0, 0, 0.08);\n      box-sizing: border-box;\n      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.10);\n      border-radius: 8px;\n      display: flex;\n      align-items: center;\n\n      font-family: 'Arial', sans-serif;\n      font-style: normal;\n      font-weight: 500;\n      font-size: 13px;\n      line-height: 19px;\n      color: rgba(0, 0, 0, 0.88);\n\n      padding: 16px;\n      gap: 8px;\n\n      opacity: 1;\n    }\n    .onekey-alert-message + .onekey-alert-message {\n      margin-top: 30px;\n    }\n    .onekey-alert-message-body {\n      display: flex;\n      align-items: center;\n      color: #13141A;\n    }\n    .onekey-alert-message-hidden {\n      opacity: 0;\n      transition: 0.3s;\n    }\n\n    .onekey-alert-message-dismiss {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      width: 32px;\n      height: 32px;\n      cursor: pointer;\n    }\n    .onekey-alert-close-icon-close {\n      flex-shrink: 0;\n      width: 24px;\n      height: 24px;\n    }\n    .onekey-strong {\n      font-weight: bold;\n      color: #13141A;\n    }\n    .onekey-alert-default-wallet {\n      border-radius: 8px;\n      height: 71px;\n\n      font-size: 12px;\n      line-height: 16px;\n      color: #13141A;\n    }\n\n    .onekey-alert-network-changed {\n      border-radius: 8px;\n      height: 71px;\n\n      font-size: 12px;\n      line-height: 16px;\n      color: #13141A;\n    }\n  ";
function notification(options) {
    var _a = options || {}, _b = _a.content, content = _b === void 0 ? "" : _b, _c = _a.duration, duration = _c === void 0 ? 0 : _c, _d = _a.triggerElement, triggerElement = _d === void 0 ? "×" : _d, _e = _a.customClass, customClass = _e === void 0 ? "" : _e, _f = _a.dismissible, dismissible = _f === void 0 ? false : _f;
    if (!container) {
        var hostElement = document.createElement('div');
        hostElement.id = 'onekey-notification-center';
        var shadowRoot = hostElement.attachShadow({ mode: 'open' });
        container = document.createElement("div");
        container.classList.add("onekey-alert-container");
        style = document.createElement("style");
        style.innerHTML = styles;
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(container);
        document.body.appendChild(hostElement);
    }
    return new Notification({
        content: content,
        duration: duration,
        triggerElement: triggerElement,
        hostElement: container,
        customClass: customClass,
        dismissible: dismissible,
        onDismiss: function () {
            if (container && !(container === null || container === void 0 ? void 0 : container.hasChildNodes())) {
                var rootNode = container.getRootNode();
                if (rootNode instanceof ShadowRoot) {
                    document.body.removeChild(rootNode.host);
                }
                else {
                    document.body.removeChild(rootNode);
                }
                style = null;
                container = null;
            }
        },
    });
}
export default notification;
var isInIframe = function () {
    return window.self !== window.top;
};
export var isInSameOriginIframe = function () {
    var _a, _b;
    if (!isInIframe()) {
        return false;
    }
    try {
        return window.self.location.origin === ((_b = (_a = window.top) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.origin);
    }
    catch (e) {
        return false;
    }
};
