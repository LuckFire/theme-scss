import path from 'path';
import { compile } from 'sass';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import logger from '#utils/logger';
import { generateBetterDiscordMeta, generateUserstyleMeta } from '#utils/meta';
import { themeConfig, paths, themeImport, themeName } from '#utils/config';

/**
 * Compile the SCSS.
 */
function compileSCSS(target: string) {
    try {
        // Make sure the target file actually exists
        if (!existsSync(target)) {
            logger.notices.error(`${logger.dye.yellow(target)} is not a valid path.`, true);
        }

        // Make sure the target path ends with .scss
        if (!target.endsWith('.scss')) {
            logger.notices.error(
                `${logger.dye.yellow(
                    target
                )} does not end with a .scss extension. Check your theme-config and try again.`,
                true
            );
        }

        return compile(target, { style: 'expanded' }).css;
    } catch (err) {
        if (!err.message.endsWith('no such file or directory')) {
            console.log(err.message);
        } else {
            logger.notices.error(`${logger.dye.yellow(target)} is not a valid file path.`, true);
        }

        return null;
    }
}

/**
 * Compile the SCSS in development mode.
 */
export function developmentCompile() {
    const start = Date.now();

    logger.notices.compiling('Changes in CSS/SCSS detected, recompiling...');

    const compiledSCSS = compileSCSS(paths.dev.target);
    if (typeof compiledSCSS !== 'string') return;

    // Make sure the output exists
    // Uses a regex to find the last instance of a back-slash, which would usually be the target output file.
    const [outDir] = paths.dev.output.split(/(\\)(?!.*\\)/);
    if (!existsSync(outDir)) {
        logger.notices.error(`${logger.dye.yellow(outDir)} is not a valid directory.`, true);
    }

    // File does not end with .css, so it cannot be compiled in the intended way.
    if (!paths.dev.output.endsWith('.css')) {
        logger.notices.error(
            `${logger.dye.yellow(
                paths.dev.output
            )} does not end with a .css extension. Check your theme-config and try again.`,
            true
        );
    }

    writeFileSync(
        paths.dev.output,
        (themeConfig.dev?.mod ? generateBetterDiscordMeta() + '\n\n' : '') + compiledSCSS
    );

    logger.notices.success(
        `Successfully recompiled, took ${logger.dye.yellow(`${Date.now() - start}ms`)}`
    );
}

/**
 * Compile the SCSS for distribution.
 */
export function productionCompile() {
    const start = Date.now();

    try {
        logger.notices.compiling('Starting to compile source files for distribution...');

        const compiledSCSS = compileSCSS(paths.dist.target);
        const platforms = themeConfig.dist.clients?.compileFor;

        // Check if SCSS was properly compiled.
        if (typeof compiledSCSS !== 'string') {
            logger.notices.error('Something went wrong when compiling your css.', true);
        }

        // Build the base source
        // Checks for the directory and if it doesn't exist, it'll be created.
        const [outDir] = paths.dist.output.split(/(\\)(?!.*\\)/);
        if (!existsSync(outDir)) {
            logger.notices.warning(
                'Source output folder does not exist, so it was created for you.'
            );
            mkdirSync(outDir, { recursive: true });
        }

        if (!paths.dist.output.endsWith('.css')) {
            logger.notices.error(
                'Your dist output path does not end with a .css extension. Check your theme-config and try again.',
                true
            );
        }

        writeFileSync(paths.dist.output, compiledSCSS);

        // Compile for other platforms
        if (!platforms || !platforms.length) {
            logger.notices.warning('You provided no clients to compile your source for.');
            return;
        } else {
            if (!existsSync(paths.dist.clients)) {
                logger.notices.warning('Output folders do not exist, creating them.');
                mkdirSync(paths.dist.clients, { recursive: true });
            }

            for (const platform of platforms) {
                logger.notices.info(`Creating an output file for ${platform}`);

                switch (platform) {
                    case 'betterdiscord':
                        const bdMeta = generateBetterDiscordMeta();
                        if (!bdMeta) {
                            logger.notices.warning(
                                'Unable to generate BetterDiscord meta, skipping compiling for this platform.'
                            );
                            continue;
                        }

                        writeFileSync(
                            path.join(paths.dist.clients, `${themeName}.theme.css`),
                            generateBetterDiscordMeta() +
                                '\n\n' +
                                `@import url("${themeImport}");\n\n` +
                                compiledSCSS
                        );

                        continue;
                    case 'userstyle':
                        const userstyleMeta = generateUserstyleMeta();
                        if (!userstyleMeta) {
                            logger.notices.warning(
                                'Unable to generate Userstyle meta, skipping compiling for this platform.'
                            );
                            continue;
                        }

                        writeFileSync(
                            path.join(paths.dist.clients, `${themeName}.user.css`),
                            `@-moz-document domain("discord.com") {\n` +
                                userstyleMeta.replace(/^/gm, '\t') +
                                '\n' +
                                `\n\t@import url("${themeImport}");\n\n` +
                                compiledSCSS.replace(/^/gm, '\t') +
                                `\n}`
                        );

                        continue;
                    default:
                        logger.notices.warning(`${platform} does not have support for compiling.`);
                        continue;
                }
            }
        }

        logger.notices.success(
            `Successfully compiled source files for distribution, took ${logger.dye.yellow(
                `${Date.now() - start}ms`
            )}.`
        );
    } catch (err) {
        console.log(err);
        logger.notices.error('Something went wrong when compiling', true);
    }
}
