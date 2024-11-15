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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionInfo = exports.siteMetadata = exports.injectedFactory = exports.consts = void 0;
__exportStar(require("./JsBridgeBase"), exports);
__exportStar(require("./ProviderBase"), exports);
__exportStar(require("./loggers"), exports);
__exportStar(require("./loggerConsole"), exports);
__exportStar(require("./injectJsBridge"), exports);
__exportStar(require("./injectedProviderReceiveHandler"), exports);
__exportStar(require("./JsBridgeSimple"), exports);
__exportStar(require("./JsBridgeIframe"), exports);
__exportStar(require("./CrossEventEmitter"), exports);
__exportStar(require("./walletProperty"), exports);
__exportStar(require("./notification"), exports);
const consts = __importStar(require("./consts"));
exports.consts = consts;
const injectedFactory_1 = __importDefault(require("./injectedFactory"));
exports.injectedFactory = injectedFactory_1.default;
const siteMetadata_1 = __importDefault(require("./siteMetadata"));
exports.siteMetadata = siteMetadata_1.default;
var versionInfo_1 = require("./versionInfo");
Object.defineProperty(exports, "versionInfo", { enumerable: true, get: function () { return __importDefault(versionInfo_1).default; } });
