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

function getDefaultValues() {
    const { name, author, description, version } = themeConfig.meta;
    const meta = { name, author, description, version };
    const missing = [];

    // Create a list of missing default meta values
    for (const [k, v] of Object.entries(meta)) {
        if (v) continue;
        missing.push(k);
    }

    // If there are any missing values, it'll check the package.json instead to fill them.
    if (missing.length) {
        try {
            const packageInfo = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));

            for (const value of Object.values(missing)) {
                if (!packageInfo[value]) {
                    // Since description isn't required, it'll just remove it.
                    if (value === 'description') {
                        delete meta[value];
                        missing.splice(missing.indexOf(value), 1);
                    }

                    continue;
                }
                
                meta[value] = packageInfo[value];
                missing.splice(missing.indexOf(value), 1);
            }

            // If it was unable to fill these values, it'll error and stop.
            if (missing.length) {
                logger.notices.error(`You are missing some meta values (${missing.join(', ')}). There was an attempt to check for an existing ${logger.dye.yellow('package.json')} to automatically fill them, but it did not have some of the required ones.`, true);
                return null;
            }
        } catch (err) {
            logger.notices.error(`You are missing some meta values (${missing.join(', ')}). There was an attempt to check for an existing ${logger.dye.yellow('package.json')} to automatically fill them, but something went wrong.`, true);
            return null;
        }
    }

    return meta;
}

export const defaultValues = getDefaultValues();

/**
 * Fetches the default meta information.
 * Not exported since once it's fetched, it shouldnt have to be fetched again.
 */
const defaultMeta = metaList(defaultValues);

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