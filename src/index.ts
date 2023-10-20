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
            .watch('src')
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
        // Compile the source.css file for imports.
        await compileTheme('source');

        // Creates the .theme.css file if a meta exists.
        if (themeConfig.meta.betterdiscord) {
            await compileTheme('bd');
        }

        // Creates the .user.css file if a meta exists.
        if (themeConfig.meta.userstyle) {
            await compileTheme('userstyle');
        }
    });

prog.parse(process.argv);