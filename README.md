# Theme SCSS
A development CLI for theme developers on Discord. Inspired by [`bd-scss`](https://github.com/Gibbu/bd-scss) -- rewritten to allow for more flexibility and expandability with client mods such as BetterDiscord, Vencord, and (not really a "client mod") Stylus.

It should be noted this was specifically written for my own use-cases, but it should be (hopefully) customizable to your own.

## Usage
### Installation
- npm `npm i -D theme-scss`
- pnpm `pnpm i -D theme-scss`
- yarn `yarn add theme-scss -D`

### Configuration
For configuration, create a `theme-config.json` file in the root of your repository. If you want to have a custom file location, create it in whichever folder and run `theme-scss -C location/to/file.json`.
|Value|Required|Purpose|
|--|--|--|
|`name`|✅|The name of your theme.|
|`author`|✅|The author of your theme.|
|`version`|✅|The version of your theme.|
|`description`|✅|The description of your theme.|
|`import`|✅|The import for your theme.|
|`metas`|❌|The locations for your meta files.|
|`dist`|❌|How the build theme should be distributed.|
|`dev`|❌|Development enviroment.|

`name`, `author`, `version`, `description` are all required values in the theme config, *unless* you have a `package.json` file it can reference these values from. If provided in your theme config, it will default those values instead of the `package.json` file values. If it cannot find these values, it will error.

##### Example
```json
{
    "name": "Theme Config Testing",
    "metas": "source/meta",
    "dist": {
        "clients": {
            "compileFor": ["betterdiscord", "userstyle"]
        }
    },
    "dev": {
        "mod": "betterdiscord"
    }
}
```

#### `metas`
If you have custom locations for all your meta `.json` files, you can specify them for each one specifically.
|Value|Required|Purpose|Default|
|--|--|--|--|
|`betterdiscord`|❌|The name of your theme.|"metas/betterdiscord.json"|
|`userstyle`|❌|The author of your theme.|"metas/userstyle.json"|

You must provide the file extension in the path. All paths are relative to the root.

#### `dist`
|Value|Required|Purpose|Default|
|--|--|--|--|
|`target`|❌|The file you want to target as your source file.|"src/source.scss"|
|`output`|❌|Where you want your compiled source file to output.|"src/source.css"|
|`clients`|❌|Where your client files should output (if applicable).|`none`|

##### `clients`
|Value|Required|Purpose|Default|
|--|--|--|--|
|`output`|❌|The folder you want your client files in.|"clients"|
|`compileFor`|❌|These are the mods it will be built for. Even if you have a meta file, you must provide this field. At the moment, this only supports `"betterdiscord"` and `"userstyle"`|`none`|

##### Example
```json
{
    "dist": {
        "target": "source/source.scss",
        "output": "dist/source.css",
        "clients": {
            "compileFor": ["betterdiscord", "userstyle"]
        }
    }
}
```

#### `dev`
|Value|Required|Purpose|Default|
|--|--|--|--|
|`mod`|❌|The client mod you're developing for.|`undefined` -- Provide a path if you're compiling for a different mod.|
|`target`|❌|The file you want to target as your source file.|"src/source.scss"|
|`output`|❌|Where your dev theme file should output.|Based on mod & os.|

If `mod` is not provided, you will have to provide a custom path for `output`. Note that if you're working on a different mod that is not supported and it requires a meta file, you will have to figure out how to provide that meta yourself.

### Client Metas
Note that `name`, `author`, `version`, `description` are not required in the meta files since they're references from `theme-config.json` or your `package.json` file.

#### BetterDiscord Meta
The betterdiscord meta file must be named `betterdiscord.json` inside of the meta path you provided (default `meta/*`). You can find all acceptable meta tags for BetterDiscord in their [documentations page](https://docs.betterdiscord.app/developers/addons#meta).

##### Example
```json
{
    "invite": "vYdXbEzqDs",
    "authorId": "399416615742996480",
    "source": "https://github.com/LuckFire/amoled-cord",
    "updateUrl": "https://github.com/LuckFire/amoled-cord/blob/main/clients/amoled-cord.theme.css"
}
```

#### Userstyle Meta
The userstyle meta file must be named `userstyle.json` inside of the meta path you provided (default `meta/*`). You can find all acceptable meta tags for Stylus in their [wiki documentation page](https://github.com/openstyles/stylus/wiki/Writing-UserCSS#metadata).

##### Example
```json
{
    "namespace": "https://github.com/discord-extensions/amoled-cord",
    "license": "MIT"
}
```