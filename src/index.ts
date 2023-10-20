#!/usr/bin/env node

import sade from 'sade';
import chokidar from 'chokidar';
import { compileTheme } from './utils/compile.js';
import { themeConfig } from './utils/config.js';
import logger from './utils/logger.js';

const prog = sade('theme-scss')
    .option('-C, --config', 'Set custom location for where your theme-config.json file is.');

prog
    .command('dev')
    .describe('Watch for changes and automatically compile them into the desired folder.')
    .action(async () => {
        chokidar
            .watch('src/**/*.scss')
            .on('ready', async () => {
                logger.notices.info(`Watching ${logger.dye.yellow('src')} for changes.`);

                // Compile on first initalization.
                await compileTheme('dev');
            })
            .on('change', async () => {
                await compileTheme('dev');
            });
    });

prog
    .command('build')
    .describe('Build the source for imports and clients.')
    .action(async () => {
        const types: ('source' | 'betterdiscord' | 'userstyle')[] = [ 'source' ];

        if (themeConfig.meta.betterdiscord) {
            types.push('betterdiscord');
        }

        if (themeConfig.meta.userstyle) {
            types.push('userstyle');
        }

        await compileTheme(types);
    });

prog.parse(process.argv);