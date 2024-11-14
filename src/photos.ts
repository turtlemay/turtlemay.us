import type { ImageMetadata } from "astro";
import path from "node:path";
import photoData from "./photos/photo-data.compiled.json";

const importPhotos = import.meta.glob<{ default: ImageMetadata }>(
	"/src/photos/**/*.{jpeg,jpg}"
);

type IPhotoData = {
	[k: string]: {
		draft?: boolean;
		caption?: string;
		location: string;
		exif: { [k: string]: unknown };
	}
};

export async function getPhotos() {
	const arr = await Promise.all(Object.keys(importPhotos).map(async k => {
		const basename = path.basename(k);
		const data = (photoData as IPhotoData)[basename];
		const { default: image } = await importPhotos[k]();
		return {
			...data,
			basename: basename,
			image: image,
			date: getExifDate(data.exif),
			cameraModel: getExifCameraModel(data.exif),
			href: `/photos/${basename}`,
		};
	}));

	const excludedDrafts = arr.filter(v => {
		return import.meta.env.PROD ? v.draft !== true : true;
	});

	const oldestFirst = excludedDrafts.sort((a, b) => a.date.valueOf() - b.date.valueOf());

	return oldestFirst.map((v, i, a) => {
		const olderItem = i > 0 ? a[i - 1] : undefined;
		const newerItem = i < a.length - 1 ? a[i + 1]: undefined;
		return {
			photoNumber: i + 1,
			prevItem: olderItem,
			nextItem: newerItem,
			...v,
		};
	});
}

export function createPhotoDateText(date: Date) {
	return date.toLocaleDateString("en-us", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function createPhotoTipText(v: Awaited<ReturnType<typeof getPhotos>>[0]) {
	const dateText = createPhotoDateText(v.date);
	if (v.caption) {
		return `${v.caption} ❖ ${dateText}`;
	} else {
		return `${dateText} ❖ ${v.location}`;
	}
}

function getExifDate(exif: { [k: string]: unknown }) {
	const str = exif["DateTimeOriginal"];
	// @ts-expect-error
	return new Date(str);
}

function getExifCameraModel(exif: { [k: string]: unknown }) {
	const make = exif["Make"];
	const model = exif["Model"];
	if (typeof make !== "string") return null;
	if (typeof model !== "string") return null;
	if (model.startsWith(make)) return model;
	return `${make} ${model}`;
}