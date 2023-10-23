/**
 * Mods that have support for compiled files.
 */
export type SupportedDistMods = 'betterdiscord' | 'userstyle';

/**
 * Mods that natively hvae support for a development environment.
 */
export type SupportedDevMods = 'betterdiscord' | 'vencord' | undefined;

export interface ThemeConfig {
    /**
     * The name of the theme.
     * If not provided, will default from `package.json`.
     */
    name?: string;
    /**
     * The author of the theme.
     * If not provided, will default from `package.json`.
     */
    author?: string;
    /**
     * The current version of the theme.
     * If not provided, will default from `package.json`.
     */
    version?: string;
    /**
     * A description of the theme.
     * If not provided, will default from `package.json`.
     */
    description?: string;
    /**
     * Imports the base source. Attempts to default base on author.
     * Setting as a string will use a custom one.
     */
    import?: string;
    /**
     * The location for all your meta files.
     */
    metas?: {
        /**
         * The file location for your BetterDiscord json file.
         * @default "metas/betterdiscord.json"
         */
        betterdiscord?: string;
        /**
         * The file location for your Userstyle json file.
         * @default "metas/userstyle.json"
         */
        userstyle?: string;
    };
    /**
     * How the build theme should be distributed.
     */
    dist?: {
        /**
         * The file you want to target as your source file.
         * @default "src/source.scss"
         */
        target?: string;
        /**
         * Where you want your compiled source file to output.
         * If provided, make sure to include the file extension, otherwise an error will throw.
         * @default "src/source.css"
         */
        output?: string;
        /**
         * Where your client files should output (if applicable).
         */
        clients?: {
            /**
             * The folder you want the client files in.
             * @default "clients"
             */
            output?: string;
            /**
             * When building, these are the mods it will be built for.
             * Even if you have a meta set, you still need to provide the string.
             * If none are provided, it will build the source as-is.
             */
            compileFor?: SupportedDistMods[];
        };
    };
    /**
     * Development enviroment.
     */
    dev?: {
        /**
         * The mod that you are compiling for.
         * If the mod is not supported by default, set to undefined and put a custom output directory.
         * NOTE: Any unsupported mod will compile without a meta, so you will have to use an SCSS file with the meta and import it (CSS compiles with comments).
         * @default undefined
         */
        mod?: SupportedDevMods | undefined;
        /**
         * The file you want to target as your source file.
         * @default "src/source.scss"
         */
        target?: string;
        /**
         * Where your theme file should output.
         * This defaults based on your operating system and mod.
         * This *must* be an absolute path if provided.
         * If provided, make sure to include the file extension, otherwise an error will throw.
         */
        output?: string;
    };
}
