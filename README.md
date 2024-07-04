# pixi-packer
`free-tex-packer-core` based example

## Usage
* For each atlas create the folder (inside the `input` folder) named by `atlas name` with textures.
* Execute:
```
node pixi-packer.mjs --minify --input=input --output=output
```

## Options
* `--input` - input folder
* `--output` - output folder
* `--padding` - atlas padding (default 1)
* `--width` - atlas max width (default 2048)
* `--height` - atlas max height (default 2048)
* `--minify` - minify atlas
* `--qmin` - min png quality for minification (default 0.6)
* `--qmax` - max png quality for minification (default 1)
