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

#### Base
|Value|Required|Purpose|
|--|--|--|
|`import`|no|A custom import URL for your theme. It'll try to default based on the author name provided, but at times you may need to provide one.|
|`meta`|yes|The meta information. This is where `default`, `betterdiscord`, and `userstyle` meta information will go.|
|`dist`|no|The distribution of your theme. This is what's used when the theme is being built.|
|`dev`|no|For development of your theme.|

#### Default Meta
Some metas will use the same values since they have the same properties. In the future, you may not have to provide a default meta period since it can reference these from any available `package.json`` file.

Any defaults do not have to be provided again in other metas.
|Value|Required|Purpose|
|--|--|--|
|`name`|yes|The name of the theme.|
|`author`|yes|The name of the author who created the theme|
|`version`|no|The current version of the theme. If not set, it will use it from your package.json if available.|
|`description`|no|The description of the theme.|

##### Example
```json
{
    "meta": {
        "default": {
            "name": "AMOLED-Cord",
            "author": "LuckFire",
            "description": "A basically pitch black theme for Discord. Lights out, baby!"
        }
    }
}
```

#### BetterDiscord Meta
You can find all acceptable meta tags for BetterDiscord in their [documentations page](https://docs.betterdiscord.app/developers/addons#meta).

##### Example
```json
{
    "meta": {
        "betterdiscord": {
            "invite": "vYdXbEzqDs",
            "authorId": "399416615742996480",
            "source": "https://github.com/LuckFire/amoled-cord",
            "updateUrl": "https://github.com/LuckFire/amoled-cord/blob/main/clients/amoled-cord.theme.css"
        }
    },
}
```

#### Userstyle Meta
You can find all acceptable meta tags for Stylus in their [wiki documentation page](https://github.com/openstyles/stylus/wiki/Writing-UserCSS#metadata).

##### Example
```json
{
    "meta": {
        "userstyle": {
            "namespace": "https://github.com/discord-extensions/amoled-cord",
            "license": "MIT"
        }
    }
}
```

#### Distribution
This will determine where / how your theme is built. If you do not have a meta for BetterDiscord and Userstyle, it will just compile the source as is.
|Value|Required|Purpose|
|--|--|--|
|`target`|no|What SCSS file should be compiled. Defaults to `src/source.scss`.|
|`output.dir`|no|The file directory you want your compiled source in. Defaults to `src/`.|
|`output.file`|no|What you want your compiled source file to be called. Defaults to `source.css`.|
|`clients`|no|Where you want your client files to be exported (such as the .theme.css file for BetterDiscord).|

##### Example
```json
{
    "dist": {
        "output": {
            "file": "amoled-cord.css"
        }
    }
}
```

#### Development
This will allow you to test your themes before publishing. At the moment, this only supports two client mods: BetterDiscord and Vencord.
|Value|Required|Purpose|
|--|--|--|
|`mode`|no|What client mod you're developing for. Takes either `bd` or `vencord`.|
|`target`|no|What SCSS file should be compiled. Defaults to `src/source.scss`.|
|`output`|no|Where your dev theme should output. Will default based on mode and operating system.|

##### Example
```json
{
    "dev": {
        "mode": "vencord"
    }
}
```