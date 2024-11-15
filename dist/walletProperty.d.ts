/**
 * An enumeration mapping specific blockchain provider names to their corresponding blockchain identifiers.
 *
 * These mappings are used to handle special cases where the provider name needs to be translated into a specific blockchain identifier for various operations.
 *
 */
export declare enum ISpecialPropertyProviderNamesReflection {
    btc = "unisat",
    sui = "suiWallet",
    polkadot = "polkadot-js"
}
export declare const DEFINE_PROPERTY_WHITELIST: string[];
export type IPlatformType = 'native' | 'extension' | 'web' | 'desktop';
export declare function checkPlatformEnable(disablePlatform?: IPlatformType[]): boolean;
export declare function checkWalletSwitchEnable(): boolean;
export declare function checkEnableDefineProperty(property: string): boolean;
export declare function defineWindowProperty(property: string, provider: unknown, options?: {
    enumerable?: boolean;
    disablePlatform?: IPlatformType[];
    alwaysInject?: boolean;
}): void;
