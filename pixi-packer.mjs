import texturePacker from "free-tex-packer-core";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import * as fs from "fs";
import * as path from "path";

const parseArgs = () =>
    process.argv.reduce((args, arg) => {
        if (arg.slice(0, 2) === "--") {
            const longArg = arg.split("=");
            const flag = longArg[0].slice(2);
            const value = longArg.length > 1 ? longArg[1] : true;
            const numericValue = parseFloat(value);
            args[flag] = !isNaN(numericValue) ? numericValue : value;
        } else if (arg[0] === "-") {
            const flags = arg.slice(1).split("");
            flags.forEach((flag) => {
                args[flag] = true;
            });
        }
        return args;
    }, {});

/**
 * @param {string} path
 * @returns {string[]}
 */
const scanFiles = directory => {
    return fs.readdirSync(directory)
        .filter(file => file.endsWith(".png"))
        .map(file => path.join(directory, file));
}

/**
 * @param {string} path
 * @returns {string[]}
 */
const scanFolders = directory => {
    return fs.readdirSync(directory)
        .filter(file => fs.statSync(path.join(directory, file)).isDirectory());
}

/**
 * @param {string} inputFolder
 * @param {string} outputFolder
 * @param {TexturePackerOptions} options
 * @param {string} path
 */
const makeAtlas = (inputFolder, outputFolder, options) => {
    const images = scanFiles(inputFolder).map(f => ({
        path: path.basename(f),
        contents: fs.readFileSync(f)
    }));
    texturePacker(images, options, (files, error) => {
        if (error) {
            console.error("Packaging failed: ", error);
            return;
        }
        for (let item of files) {
            const fileName = path.join(outputFolder, item.name);
            fs.writeFileSync(fileName, item.buffer);
        }
    });
}

const args = parseArgs();
const inputFolder = args.input;
const outputFolder = args.output;
if (!inputFolder || !outputFolder) {
    console.error("Some of the required parameters are missing");
}
const atlasPadding = args.padding ?? 1;
const atlasWidth = args.width ?? 2048;
const atlasHeight = args.height ?? 2048;
const minify = Boolean(args.minify);
const pngQualityMin = args.qmin ?? 0.6;
const pngQualityMax = args.qmax ?? 1;

// makeAtlas
scanFolders(inputFolder).forEach(atlasFolder => {
    const options = {
        textureName: atlasFolder,
        width: atlasWidth,
        height: atlasHeight,
        fixedSize: false,
        powerOfTwo: true,
        padding: atlasPadding,
        allowRotation: true,
        detectIdentical: true,
        allowTrim: true,
        exporter: "Pixi",
        removeFileExtension: true,
        prependFolderName: true,
    };
    makeAtlas(path.join(inputFolder, atlasFolder), outputFolder, options);
});

// minify
minify && await imagemin([`${outputFolder}/*.{jpg,png}`], {
    destination: outputFolder,
    plugins: [
        imageminJpegtran(),
        imageminPngquant({
            quality: [pngQualityMin, pngQualityMax],
        })
    ]
});
