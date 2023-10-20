import path from "path";
import { themeConfig } from "./config.js";
import { getThemeFolder } from "./os.js";

/** The theme author. */
const themeAuthor = themeConfig.meta.author?.toLocaleLowerCase();
/** The name of the theme. */
export const themeName = themeConfig.meta.name?.toLocaleLowerCase().split(' ').join('-');

/** The @import for the theme's source. */
export const themeImport = themeConfig.import || `https://${themeAuthor}.github.io/${themeName}/${themeConfig.dist?.output?.dir || 'src'}/${themeConfig.dist?.output?.file || 'source.css'}`;
/** Default paths for easy use. */
export const paths = {
    dev: {
        folder: getThemeFolder(themeConfig.dev?.mode || 'bd'),
        theme: path.join(getThemeFolder(themeConfig.dev?.mode || 'bd'), `${themeName}.theme.css`)
    },
    source: path.resolve(themeConfig.dist?.target || 'src/source.scss'),
    output: path.resolve(themeConfig.dist?.output?.dir || 'src', themeConfig.dist?.output?.file || 'source.css'),
    clients: {
        folder: path.resolve(themeConfig.dist?.clients || 'clients'),
        betterdiscord: path.resolve(themeConfig.dist?.clients || 'clients', `${themeName}.theme.css`),
        userstyle: path.resolve(themeConfig.dist?.clients || 'clients', `${themeName}.user.css`)
    }
};