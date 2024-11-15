/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconDismiss } from './icon';
class Notification {
    constructor(settings) {
        this.settings = settings;
        this.element = document.createElement("div");
        this.element.className = `chargerwallet-alert-message ${this.settings.customClass ? this.settings.customClass : ""}`;
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
    insert() {
        var _a;
        if (!this.element) {
            return;
        }
        // content container
        const contentContainer = document.createElement("div");
        contentContainer.className = "chargerwallet-alert-message-body";
        contentContainer.innerHTML = this.settings.content;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.appendChild(contentContainer);
        // dismiss button
        if (this.settings.dismissible) {
            this.dismissButton = document.createElement("div");
            this.dismissButton.className = "chargerwallet-alert-message-dismiss";
            const dismissIcon = document.createElement("img");
            dismissIcon.setAttribute("src", IconDismiss);
            dismissIcon.className = "chargerwallet-alert-close-icon";
            this.dismissButton.appendChild(dismissIcon);
            this.element.appendChild(this.dismissButton);
        }
        this.settings.hostElement.appendChild(this.element);
    }
    bindEvents() {
        var _a;
        this.eventHandlers.dismiss = () => this.dismiss();
        (_a = this.dismissButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.eventHandlers.dismiss, false);
    }
    initiateTimer(duration = this.settings.duration) {
        this.dismissalTimer = setTimeout(() => {
            this.dismiss();
        }, duration);
    }
    cancelTimer() {
        if (this.dismissalTimer) {
            clearTimeout(this.dismissalTimer);
            this.dismissalTimer = null;
        }
    }
    dismiss() {
        if (!this.element) {
            return;
        }
        this.element.classList.add(".chargerwallet-alert-message-hidden");
        this.settings.hostElement.removeChild(this.element);
        this.element = null;
        if (this.settings.onDismiss) {
            this.settings.onDismiss();
        }
        this.cancelTimer();
    }
}
let container = null;
let style = null;
const styles = `
    .chargerwallet-alert-container {
      position: fixed;
      z-index: 99999;
      top: 60px;
      right: 42px;
    }
    .chargerwallet-alert-message {
      min-width: 230px;
      min-height: 44px;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-sizing: border-box;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.10);
      border-radius: 8px;
      display: flex;
      align-items: center;

      font-family: 'Arial', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 19px;
      color: rgba(0, 0, 0, 0.88);

      padding: 16px;
      gap: 8px;

      opacity: 1;
    }
    .chargerwallet-alert-message + .chargerwallet-alert-message {
      margin-top: 30px;
    }
    .chargerwallet-alert-message-body {
      display: flex;
      align-items: center;
      color: #13141A;
    }
    .chargerwallet-alert-message-hidden {
      opacity: 0;
      transition: 0.3s;
    }

    .chargerwallet-alert-message-dismiss {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      cursor: pointer;
    }
    .chargerwallet-alert-close-icon-close {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }
    .chargerwallet-strong {
      font-weight: bold;
      color: #13141A;
    }
    .chargerwallet-alert-default-wallet {
      border-radius: 8px;
      height: 71px;

      font-size: 12px;
      line-height: 16px;
      color: #13141A;
    }

    .chargerwallet-alert-network-changed {
      border-radius: 8px;
      height: 71px;

      font-size: 12px;
      line-height: 16px;
      color: #13141A;
    }
  `;
function notification(options) {
    const { content = "", duration = 0, triggerElement = "×", customClass = "", dismissible = false, } = options || {};
    if (!container) {
        const hostElement = document.createElement('div');
        hostElement.id = 'chargerwallet-notification-center';
        const shadowRoot = hostElement.attachShadow({ mode: 'open' });
        container = document.createElement("div");
        container.classList.add("chargerwallet-alert-container");
        style = document.createElement("style");
        style.innerHTML = styles;
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(container);
        document.body.appendChild(hostElement);
    }
    return new Notification({
        content,
        duration,
        triggerElement,
        hostElement: container,
        customClass,
        dismissible,
        onDismiss: () => {
            if (container && !(container === null || container === void 0 ? void 0 : container.hasChildNodes())) {
                const rootNode = container.getRootNode();
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
const isInIframe = () => {
    return window.self !== window.top;
};
export const isInSameOriginIframe = () => {
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
