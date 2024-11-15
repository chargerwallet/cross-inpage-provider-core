/**
 * Returns whether the given image URL exists
 * @param url - the url of the image
 * @returns Whether the image exists.
 */
declare function imgExists(url: string): Promise<boolean>;
/**
 * Gets site metadata and returns it
 *
 */
declare function getSiteMetadata(): Promise<{
    name: string;
    icon: string | null;
}>;
/**
 * Extracts a name for the site from the DOM
 */
declare function getSiteName(windowObject: typeof window): string;
/**
 * Extracts an icon for the site from the DOM
 * @returns an icon URL
 */
declare function getSiteIcon(windowObject: typeof window): Promise<string | null>;
declare const _default: {
    getSiteMetadata: typeof getSiteMetadata;
    getSiteIcon: typeof getSiteIcon;
    getSiteName: typeof getSiteName;
    imgExists: typeof imgExists;
};
export default _default;
