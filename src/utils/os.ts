import path from "path";
import { themeConfig } from "./config.js";
import logger from "./logger.js";

/**
 * Gets the operating system.
 */
function getOS() {
    switch (process.platform) {
        case 'win32':
            return 'WINDOWS';
        case 'darwin':
            return 'MACOS';
        // Until I can get this added properly..
        // case 'linux':
        //     return 'LINUX';
        default: 
            logger.notices.error(`${process.platform} is not supported for development.`, true);
            return null;
    }
}

export const OS = getOS();

/**
 * Gets the theme folder for a specific client mod.
 */
export function getThemeFolder(mod: 'bd' | 'vencord') {
    let folder: string | undefined = themeConfig.dev?.output;

    // A path was already specificed
    if (folder) return folder;

    switch (mod){
        case 'bd':
            if (OS === 'WINDOWS') {
                folder = path.resolve(process.env.APPDATA, 'BetterDiscord', 'themes');
            } else {
                folder = path.resolve(process.env.HOME, 'Library', 'Application Support', 'BetterDiscord', 'themes');
            }

            break;
        case 'vencord':
            if (OS === 'WINDOWS') {
                folder = path.resolve(process.env.APPDATA, 'Vencord', 'themes');
            } else {
                folder = path.resolve(process.env.HOME, 'Library', 'Application Support', 'Vencord', 'themes');
            }

            break;
        default:
            logger.notices.error(`${mod} is not supported for development.`, true);
            return;
    }

    return folder;
}