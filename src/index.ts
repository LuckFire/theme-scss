#!/usr/bin/env node

import sade from 'sade';
import chokidar from 'chokidar';
import logger from '#utils/logger';
import { developmentCompile, productionCompile } from '#utils/compile';

const prog = sade('theme-scss').option(
    '-C, --config',
    'Set custom location for where your theme-config.json file is.'
);

prog.command('dev')
    .describe('Watch for changes and automatically compile them into the desired folder.')
    .action(async () => {
        chokidar
            .watch(['src/**/*.scss', 'src/**/*.css'])
            .on('ready', () => {
                logger.notices.watching(
                    `Watching ${logger.dye.yellow('src')} for CSS/SCSS changes.`
                );
                developmentCompile(); // Compile on init
            })
            .on('change', () => {
                developmentCompile();
            });
    });

prog.command('build')
    .describe('Build the source for imports and clients.')
    .action(async () => productionCompile());

prog.parse(process.argv);
