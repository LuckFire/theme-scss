import path from 'path';
import { readFileSync } from 'fs';
import { getThemeFolder } from '#utils/os';
import logger from '#utils/logger';
import type { ThemeConfig } from '#types/theme-config.d.ts';

type MetaDefaultValues = 'name' | 'author' | 'description' | 'version';

const configPath = path.join(process.cwd(), process.argv[4] || 'theme-config.json');

/**
 * Fetched the config file contents.
 */
function getConfig() {
    try {
        const config = JSON.parse(readFileSync(configPath, 'utf-8'));

        return config as ThemeConfig;
    } catch (err) {
        if (err.code === 'ENOENT') {
            logger.notices.error(
                `Unable to locate ${logger.dye.yellow(configPath)}. Double check that it exists.`,
                true
            );
            return null;
        }

        logger.notices.error(err, true);
        return null;
    }
}

/**
 * Cached config file information so there's no need to refetch.
 */
export const themeConfig = getConfig();

/**
 * Get information that's used in all metas (name, author, version, description).
 */
function defaultInfo() {
    const { name, author, description, version } = themeConfig;
    const defaults: { [key in MetaDefaultValues]: string } = { name, author, description, version };

    // Creates a list of missing meta default values.
    const missing: Partial<MetaDefaultValues[]> = [];
    for (const [k, v] of Object.entries(defaults)) {
        if (v) continue;
        missing.push(k as MetaDefaultValues);
    }

    // If there are missing values that are required, it will check a package.json file.
    if (missing.length) {
        try {
            const packageJson = JSON.parse(
                readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
            );

            for (const value of Object.values(missing)) {
                if (!packageJson[value]) {
                    // A description isn't a required value, so it's ignored and removed from defaults if not found.
                    if (value === 'description') {
                        delete defaults[value];
                        missing.splice(missing.indexOf(value), 1);
                    }

                    continue;
                }

                defaults[value] = packageJson[value];
                missing.splice(missing.indexOf(value), 1);
            }

            // If it still wasnt able to replace missing values, it'll error and stop.
            if (missing.length) {
                logger.notices.error(
                    `You are missing some meta values (${missing.join(
                        ', '
                    )}). There was an attempt to use your ${logger.dye.yellow(
                        'package.json'
                    )} file, but it was missing these values as well.`,
                    true
                );
            }
        } catch (err) {
            console.log(err);

            logger.notices.error(
                `You are missing some meta values (${missing.join(
                    ', '
                )}). There was an attempt to use your ${logger.dye.yellow(
                    'package.json'
                )} file, but it appears to not exist.`,
                true
            );
        }
    }

    return defaults;
}

export const defaultMetaInfo = defaultInfo();

/**
 * Cached default information so there's no need to refetch.
 */
export const defaults = {
    ...defaultMetaInfo,
    dist: {
        output: themeConfig.dist.output || 'src/source.css',
        target: themeConfig.dist.target || 'src/source.scss'
    }
};

export const themeName = defaults.name.toLowerCase().replaceAll(' ', '-');
export const themeImport =
    themeConfig.import ||
    `https://${defaults.author.toLowerCase().replaceAll(' ', '-')}.github.io/${themeName}/${
        defaults.dist.output
    }`;

/**
 * Path file locations for files.
 */
export const paths = {
    themeMetas: {
        betterdiscord: path.join(
            process.cwd(),
            themeConfig?.metas?.betterdiscord || 'metas/betterdiscord.json'
        ),
        userstyle: path.join(process.cwd(), themeConfig?.metas?.userstyle || 'metas/userstyle.json')
    },
    dist: {
        output: path.resolve(themeConfig.dist?.output || 'src/source.css'),
        target: path.resolve(themeConfig.dist?.target || 'src/source.scss'),
        clients: path.resolve(themeConfig.dist.clients?.output || 'clients')
    },
    dev: {
        target: path.resolve(themeConfig.dev?.target || 'src/source.scss'),
        output: getThemeFolder(themeConfig.dev?.mod || undefined)
    }
};
