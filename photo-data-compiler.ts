// @ts-check
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";

interface IFilePaths {
	/** Directory of photos. */
	readonly photosDir: string;
	/** Path to JSON file with photo data. */
	readonly dataFile: string;
	/** Where to output compiled JSON photo data. */
	readonly outFile: string;
}

/** Read our photo data file and recompile it to include exif data. */
async function compilePhotoData(args: IFilePaths) {
	// Read photo data file.
	const readFile = await fsp.readFile(args.dataFile, "utf-8");
	const json = JSON.parse(readFile);

	// Get all image paths in directory to use as indices.
	const dirFilePaths = (await fsp.readdir(args.photosDir)).map(v => `${args.photosDir}/${v}`);
	const imageFilter = (path: string) => path.endsWith(".jpg")
	const imageFilePaths = dirFilePaths.filter(imageFilter);

	// Read exif data and save to object.
	const outputData = { ...json };
	for (const v of imageFilePaths) {
		const file = await fsp.readFile(v);
		const exif = await exifr.parse(file);
		outputData[path.basename(v)].exif = exif;
	}

	// Save our compiled data to output file.
	await fsp.writeFile(args.outFile, JSON.stringify(outputData));
}

export function photoDataAstroIntegration(args: IFilePaths) {
	return {
		name: "photo-data-compiler",
		hooks: {
			"astro:config:setup": async () => {
				await compilePhotoData(args);
				fs.watchFile(args.dataFile, () => compilePhotoData(args));
			},
		},
	};
}