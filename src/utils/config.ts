import path from "path";
import { readFileSync } from "fs";
import logger from "./logger.js";
import { ThemeConfig } from "../types/config.js";

/**
 * Fetches the config file.
 * Not exported since once it's fetched, it shouldnt have to be fetched again.
 */
function config() {
    try {
        const config = JSON.parse(
            readFileSync(path.resolve(process.argv[4] || 'theme-config.json'), 'utf-8')
        );

        return config as ThemeConfig
    } catch (err) {
        if (err.code === 'ENOENT') {
            logger.notices.error(`Unable to locate your ${logger.dye.yellow('theme-config.json')} file. Double check that it exists.`, true);
            return null;
        }

        logger.notices.error(err, true);
        return null;
    }
}

/**
 * Fetches the config file.
 */
export const themeConfig = config();

/**
 * Generates a list of meta details for parsing later.
 * @param meta A meta's object.
 */
function metaList(meta: { [key: string]: any }) {
    const details: string[] = [];

    for (const [k, v] of Object.entries(meta)) {
        details.push(`${k} ${v}`);
    }

    return details;
}

/**
 * Fetches the default meta information.
 * Not exported since once it's fetched, it shouldnt have to be fetched again.
 */
function getDefaultMeta() {
    const { meta } = themeConfig;

    // Checks whether meta or meta.default has any existing properties.
    if (!meta || !meta.default) {
        logger.notices.error('Your meta is missing default meta information.', true);
        return null;
    }

    // Checks whether meta.default has the required properties (author, name).
    if (meta.default && !(meta.default.author || meta.default.name)) {
        logger.notices.error('Your meta is missing an author and or theme name.', true);
        return;
    }
    if (!meta.default.version) {
        try {
            const packageInfo = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
    
            meta.default.version = packageInfo.version;
        } catch (err) {
            logger.notices.error('You did not provide a version in your meta. There was an attempt to use your package.json file, but that also does not exist.', true);
            return null;
        }
    }

    return metaList(meta.default);
};

/**
 * Fetches the default meta information.
 */
export const defaultMeta = getDefaultMeta();

/**
 * Gets the BetterDiscord meta.
 */
export function getBDMeta() {
    const { betterdiscord } = themeConfig.meta;

    const style = `\n * @`;
    const meta = [ ...defaultMeta, ...metaList(betterdiscord) ]
        .join(style);

    return `/**`
        + style
        + meta
        + `\n */`;
}

/**
 * Gets the Userstyle meta.
 */
export function getUserstyleMeta() {
    const { userstyle } = themeConfig.meta;

    const style = `\n\t@`;
    const meta = [ ...defaultMeta, ...metaList(userstyle) ]
        .join(style);

    return `\t/* ==UserStyle==`
        + style
        + meta
        + `\n\t==/UserStyle== */`
}