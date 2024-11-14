// @ts-check
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";

const PHOTOS_DIR = "src/photos";
const INPUT_JSON_PATH = "src/photos/photo-data.json";
const OUTPUT_JSON_PATH = "src/photos/photo-data.compiled.json";

async function compilePhotoData(input = INPUT_JSON_PATH, output = OUTPUT_JSON_PATH) {
	const readFile = await fsp.readFile(input, "utf-8");
	const json = JSON.parse(readFile);

	const dirFilePaths = (await fsp.readdir(PHOTOS_DIR)).map(v => `${PHOTOS_DIR}/${v}`);
	const imageFilePaths = dirFilePaths.filter(v => v.endsWith(".jpg"));

	const outputJson = { ...json };
	for (const v of imageFilePaths) {
		const file = await fsp.readFile(v);
		const exif = await exifr.parse(file);
		outputJson[path.basename(v)].exif = exif;
	}

	await fsp.writeFile(output, JSON.stringify(outputJson));
}

export function photoDataAstroIntegration() {
	return {
		name: "photo-data-compiler",
		hooks: {
			"astro:config:setup": async () => {
				await compilePhotoData();
				fs.watchFile(INPUT_JSON_PATH, () => compilePhotoData());
			},
		},
	};
}