import { readFileSync } from 'fs';
import { defaultMetaInfo, paths } from '#utils/config';
import logger from '#utils/logger';

/**
 * Creates a list for meta information.
 * This is used to create a string for specific metas after generating it from a list.
 */
function formatList(meta: { [key: string]: any }) {
    const details: string[] = [];

    for (const [k, v] of Object.entries(meta)) {
        details.push(`${k} ${v}`);
    }

    return details;
}

/**
 * Cached default meat list so there's no need to refetch.
 */
const defaultMeta = formatList(defaultMetaInfo);

// TODO: Make code below in a single function.
// This would overall be better since it accomplishes the same thing pretty much.

/**
 * Generates a BetterDiscord meta.
 * This is only ran if 'betterdiscord' is provided in compileFor in the theme-config.
 */
export function generateBetterDiscordMeta() {
    try {
        const meta = JSON.parse(readFileSync(paths.themeMetas.betterdiscord, 'utf-8'));

        const style = `\n * @`;
        const info = [...defaultMeta, ...formatList(meta)].join(style);

        return `/**` + style + info + `\n*/`;
    } catch (err) {
        logger.notices.error(
            `Your ${logger.dye.yellow(
                'betterdiscord.json'
            )} meta file does not exist, so a meta cannot be generated.`
        );
    }

    return null;
}

/**
 * Generates a Userstyle meta.
 * This is only ran if 'userstyle' is provided in compileFor in the theme-config.
 */
export function generateUserstyleMeta() {
    try {
        const meta = JSON.parse(readFileSync(paths.themeMetas.userstyle, 'utf-8'));

        const style = `\n@`;
        const info = [...defaultMeta, ...formatList(meta)].join(style);

        return `/* ==UserStyle==` + style + info + `\n==/UserStyle== */`;
    } catch (err) {
        logger.notices.error(
            `Your ${logger.dye.yellow(
                'userstyle.json'
            )} meta file does not exist, so a meta cannot be generated.`
        );
    }

    return null;
}
