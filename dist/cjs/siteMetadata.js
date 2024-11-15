"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns whether the given image URL exists
 * @param url - the url of the image
 * @returns Whether the image exists.
 */
function imgExists(url) {
    return new Promise((resolve, reject) => {
        try {
            const img = document.createElement('img');
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
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
    return __awaiter(this, void 0, void 0, function* () {
        return {
            name: getSiteName(window),
            icon: yield getSiteIcon(window),
        };
    });
}
/**
 * Extracts a name for the site from the DOM
 */
function getSiteName(windowObject) {
    const { document } = windowObject;
    const siteName = document.querySelector('head > meta[property="og:site_name"]');
    if (siteName) {
        return siteName.content;
    }
    const metaTitle = document.querySelector('head > meta[name="title"]');
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
    return __awaiter(this, void 0, void 0, function* () {
        const { document } = windowObject;
        const icons = document.querySelectorAll('head > link[rel~="icon"]');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const iconsArr = icons;
        for (const icon of iconsArr) {
            if (icon && (yield imgExists(icon.href))) {
                return icon.href;
            }
        }
        return null;
    });
}
exports.default = {
    getSiteMetadata,
    getSiteIcon,
    getSiteName,
    imgExists,
};
