import { compile } from "sass";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { themeImport, paths } from "./constants.js";
import logger from "./logger.js";
import { getBDMeta, getUserstyleMeta } from "./config.js";

/**
 * The compiled SCSS. Only used for distribution, development will always recompile.
 */
export const compiledSCSS = compile(paths.source, { style: 'expanded' }).css;

/**
 * Compiles the theme for distribution.
 * @param type The type to compile for.
 */
export async function compileTheme(type: 'source' | 'bd' | 'userstyle' | 'dev') {
    const start = Date.now();
    logger.notices.compiling(`Compiling for ${type} from ${logger.dye.yellow(paths.source)}`);

    try {
        switch (type) {
            case 'bd':
                if (!existsSync(paths.clients.folder)) {
                    logger.notices.warning('Output folders do not exist, creating them.');
                    mkdirSync(paths.clients.folder, { recursive: true });
                }

                writeFileSync(paths.clients.betterdiscord,
                    getBDMeta()
                    + '\n\n'
                    + `@import url("${themeImport}");\n\n`
                    + compiledSCSS
                );

                break;
            case 'userstyle':
                if (!existsSync(paths.clients.folder)) {
                    logger.notices.warning('Output folders do not exist, creating them.');
                    mkdirSync(paths.clients.folder, { recursive: true });
                }

                writeFileSync(paths.clients.userstyle,
                    `@-moz-document domain("discord.com") {\n`
                    + getUserstyleMeta() + '\n'
                    + `\n\t@import url("${themeImport}");\n\n`
                    + compiledSCSS.replace(/^/gm, "\t")
                    + `\n}`
                );

                break;
            case 'dev':
                if (!existsSync(paths.dev.folder)) {
                    logger.notices.error('Dev folder does not exist.', true);
                    return;
                }

                writeFileSync(paths.dev.theme,
                    getBDMeta()
                    + '\n\n'
                    + compile(paths.source, { style: 'expanded' }).css
                );

                break;
            default:
                writeFileSync(paths.output, compiledSCSS);
                break;
        }
    } catch (err) {
        logger.notices.error(`Failed to compile for ${type} from ${logger.dye.yellow(paths.source)}, took ${logger.dye.yellow(`${Date.now() - start}ms.`)}`);
        console.log(err);
    }

    logger.notices.success(`Compiled for ${type}, took ${logger.dye.yellow(`${Date.now() - start}ms`)}`);
}