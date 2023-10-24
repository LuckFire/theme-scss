import path from 'path';
import logger from '#utils/logger';
import { themeConfig, themeName } from '#utils/config';
import type { SupportedDevMods } from '#types/theme-config.d.ts';

/**
 * Gets the supported operating systems.
 */
function supportedOS() {
    switch (process.platform) {
        case 'win32':
        case 'darwin':
        case 'linux':
            return process.platform;
        default:
            if (!themeConfig.dev?.output) {
                logger.notices.error(
                    `${process.platform} is not supported for development. Please provide a custom output path for development instead.`
                );
            }

            return null;
    }
}

/**
 * Runs the function to get the operating system.
 */
const OS = supportedOS();

/**
 * Gets the theme folder for a specific client mod.
 */
export function getThemeFolder(mod: SupportedDevMods) {
    // A path was specificed so we use that instead.
    if (themeConfig.dev?.output) return themeConfig.dev?.output;

    let file: string;

    switch (mod) {
        case 'betterdiscord':
            if (OS === 'win32') {
                file = path.resolve(process.env.APPDATA, 'BetterDiscord', 'themes');
            } else if (OS === 'darwin') {
                file = path.resolve(
                    process.env.HOME,
                    'Library',
                    'Application Support',
                    'BetterDiscord',
                    'themes'
                );
            } else if (OS === 'linux') {
                file = path.resolve(process.env.HOME, '.local', 'share', 'BetterDiscord', 'themes');
            }

            break;
        case 'vencord':
            if (OS === 'win32') {
                file = path.resolve(process.env.APPDATA, 'Vencord', 'themes');
            } else if (OS === 'darwin') {
                file = path.resolve(
                    process.env.HOME,
                    'Library',
                    'Application Support',
                    'Vencord',
                    'themes'
                );
            } else if (OS === 'linux') {
                file = path.resolve(process.env.HOME, 'user', '.config', 'Vencord', 'themes');
            }

            break;
        default:
            logger.notices.error(
                `${mod} is not supported for development. Please provide a custom path instead.`,
                true
            );

            return;
    }

    file = path.join(file, `${themeName}.theme.css`);

    return file;
}
