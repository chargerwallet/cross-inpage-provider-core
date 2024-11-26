var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Returns whether the given image URL exists
 * @param url - the url of the image
 * @returns Whether the image exists.
 */
function imgExists(url) {
    return new Promise(function (resolve, reject) {
        try {
            var img = document.createElement('img');
            img.onload = function () { return resolve(true); };
            img.onerror = function () { return resolve(false); };
            img.src = url;
        }
        catch (e) {
            reject(e);
        }
    });
}
/**
 * Gets site metadata and returns it
 *
 */
function getSiteMetadata() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {
                        name: getSiteName(window)
                    };
                    return [4 /*yield*/, getSiteIcon(window)];
                case 1: return [2 /*return*/, (_a.icon = _b.sent(),
                        _a)];
            }
        });
    });
}
/**
 * Extracts a name for the site from the DOM
 */
function getSiteName(windowObject) {
    var document = windowObject.document;
    var siteName = document.querySelector('head > meta[property="og:site_name"]');
    if (siteName) {
        return siteName.content;
    }
    var metaTitle = document.querySelector('head > meta[name="title"]');
    if (metaTitle) {
        return metaTitle.content;
    }
    if (document.title && document.title.length > 0) {
        return document.title;
    }
    return window.location.hostname;
}
/**
 * Extracts an icon for the site from the DOM
 * @returns an icon URL
 */
function getSiteIcon(windowObject) {
    return __awaiter(this, void 0, void 0, function () {
        var document, icons, iconsArr, _i, iconsArr_1, icon, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    document = windowObject.document;
                    icons = document.querySelectorAll('head > link[rel~="icon"]');
                    iconsArr = icons;
                    _i = 0, iconsArr_1 = iconsArr;
                    _b.label = 1;
                case 1:
                    if (!(_i < iconsArr_1.length)) return [3 /*break*/, 5];
                    icon = iconsArr_1[_i];
                    _a = icon;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, imgExists(icon.href)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    if (_a) {
                        return [2 /*return*/, icon.href];
                    }
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, null];
            }
        });
    });
}
export default {
    getSiteMetadata: getSiteMetadata,
    getSiteIcon: getSiteIcon,
    getSiteName: getSiteName,
    imgExists: imgExists,
};
