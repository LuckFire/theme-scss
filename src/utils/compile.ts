import { compile } from "sass";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { themeImport, paths } from "./constants.js";
import logger from "./logger.js";
import { getBDMeta, getUserstyleMeta } from "./config.js";

function compileSCSS() {
    try {
        return compile(paths.source, { style: 'expanded' }).css;
    } catch (err) {
        if (!err.message.endsWith('no such file or directory')) {
            console.log(err.message);
        }
        else {
            logger.notices.error(`${logger.dye.yellow(paths.source)} does not exist.`, true);
        }

        return null;
    }
}

/**
 * Compiles the theme for distribution.
 * @param type The type to compile for.
 */
export async function compileTheme(types: 'dev' | ('source' | 'betterdiscord' | 'userstyle')[]) {
    const start = Date.now();
    logger.notices.compiling(`Compiling source from ${logger.dye.yellow(paths.source)}`);

    try {
        const compiledSCSS = compileSCSS();
        if (!compiledSCSS) {
            logger.notices.error('Failed to compile scss.');
            return;
        };

        // Only compile in the area needed for development.
        if (types === 'dev') {
            if (!existsSync(paths.dev.folder)) {
                logger.notices.error('Dev folder does not exist.', true);
                return;
            }

            writeFileSync(paths.dev.theme,
                getBDMeta()
                + '\n\n'
                + compiledSCSS
            );

            logger.notices.success(`Compiled for development, took ${logger.dye.yellow(`${Date.now() - start}ms`)}`);
            return;
        }

        // Create clients folder if it does not exist.
        if (!existsSync(paths.clients.folder)) {
            logger.notices.warning('Output folders do not exist, creating them.');
            mkdirSync(paths.clients.folder, { recursive: true });
        }

        // Iterate through the types to compile for.
        for (const type of types) {
            if (type === 'source') {
                writeFileSync(paths.output, compiledSCSS);
            }

            if (type === 'betterdiscord') {
                writeFileSync(paths.clients.betterdiscord,
                    getBDMeta()
                    + '\n\n'
                    + `@import url("${themeImport}");\n\n`
                    + compiledSCSS
                );
            }

            if (type === 'userstyle') {
                writeFileSync(paths.clients.userstyle,
                    `@-moz-document domain("discord.com") {\n`
                    + getUserstyleMeta() + '\n'
                    + `\n\t@import url("${themeImport}");\n\n`
                    + compiledSCSS.replace(/^/gm, "\t")
                    + `\n}`
                );
            }

            logger.notices.success(`Compiled for ${type}, took ${logger.dye.yellow(`${Date.now() - start}ms`)}`);
        }
    } catch (err) {
        console.log(err);
        logger.notices.error(`Failed to compile from ${logger.dye.yellow(paths.source)}, took ${logger.dye.yellow(`${Date.now() - start}ms.`)}`, true);
    }

    logger.notices.success(`Finished compiling, took ${logger.dye.yellow(`${Date.now() - start}ms`)}`);
}