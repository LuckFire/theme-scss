export interface BetterDiscordMeta {
    /**
     * A Discord invite code, useful for directing users to a support server.
     */
    invite?: string;
    /**
     * Discord snowflake ID of the developer. This allows users to get in touch.
     */
    authorId?: string;
    /**
     * Link to use for the author's name on the addon pages.
     */
    authorLink?: string;
    /**
     * Link to use for the author's name on the addon pages.
     */
    donate?: string;
    /**
     * Link to the patreon of the developer.
     */
    patreon?: string;
    /**
     * Developer's (or addon's) website link.
     */
    website?: string;
    /**
     * Link to the source on GitHub of the addon.
     */
    source?: string;
    /**
     * Link to the update url of the addon.
     */
    updateUrl?: string;
}

export interface UserStyleMeta {
    /**
     * The namespace of the UserCSS. Mandatory.
     * Helps to distinguish between styles with the same name. Usually, the author's nickname or homepage. Can contain spaces and special characters.
     */
    namespace: string;
    /**
     * The project's homepage that is used in Stylus' Manage and Edit pages to link to UserCSS source.
     * This is not an update URL. The update path is the URL the UserCSS was installed from.
     */
    homepageURL?: string;
    /**
     * The URL the user can report issues to the UserCSS author. Displayed as "Feedback" link in the style's UserCSS configuration popup.
     */
    supportURL?: string;
    /**
     * When defined, this URL is used when updating the style otherwise the style is updated from where it was installed.
     */
    updateURL?: boolean;
    /**
     * Include a license based on the SPDX license identifier external link. Essential.
     */
    license?: string
}

export interface DefaultMeta {
    /**
     * The name of the theme.
     */
    name: string;
    /**
     * The author of the theme.
     */
    author: string;
    /**
     * The current version of the theme.
     * If not set, will try to use the package.json version.
     */
    version: string;
    /**
     * A description of the theme.
     */
    description?: string;
}

export interface Meta {
    /**
     * The name of the theme.
     */
    name: string;
    /**
     * The author of the theme.
     */
    author: string;
    /**
     * The current version of the theme.
     * If not set, will try to use the package.json version.
     */
    version: string;
    /**
     * A description of the theme.
     */
    description?: string;
    /**
     * BetterDiscord's meta.
     */
    betterdiscord?: BetterDiscordMeta;
    /**
     * sUserStyle meta.
     */
    userstyle?: UserStyleMeta;
}

export interface ThemeConfig {
    /**
     * Import file for the theme.
     */
    import?: string;
    /**
     * The meta for the theme.
     */
    meta: Meta;
    /**
     * The target of the file to build and where it should be built.
     */
    dist?: {
        /**
         * The file you want to target as your source file.
         * @default "src/source.scss"
         */
        target?: string;
        /**
         * Where you want your compiled source file to output to.
         */
        output?: {
            /**
             * The file directory you want the file in.
             * @default "src"
             */
            dir?: string;
            /**
             * The name you want your source file to be.
             * @default "source.css"
             */
            file?: string;
        };
        /**
         * Where client files should be exported.
         * @default "clients"
         */
        clients?: string;
    };
    dev?: {
        /**
         * The client mod you're needing a development environment for.
         * @default 'bd'
         */
        mode?: 'bd' | 'vencord',
        /**
         * The file you want to target as your source file.
         * @default "src/source.scss"
         */
        target?: string;
        /**
         * Where your dev theme file should output.
         */
        output?: string;
    }
}