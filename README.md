# pixi-packer
`free-tex-packer-core` based example

## Usage
* For each atlas create the folder (inside the `input` folder) named by `atlas name` with textures.
* Execute:
```
node pixi-packer.mjs -m --input=input --output=output
```

## Options
* `--inputFolder`
* `--outputFolder`
* `--atlasPadding` (default 1)
* `--atlasWidth` (default 2048)
* `--atlasHeight` (default 2048)
* `-m` - do minify atlas
* `--pngQualityMin` - min png quality for minification (default 0.6)
* `--pngQualityMax` - max png quality for minification (default 1)
