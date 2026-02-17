// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { photoDataAstroIntegration } from "./photo-data-compiler";

export default defineConfig({
	site: "https://www.turtlemay.us/",
	integrations: [
		mdx(),
		sitemap(),
		photoDataAstroIntegration({
			photosDir: "src/photos",
			dataFile: "src/photos/photo-data.json",
			outFile: "src/photos/photo-data.compiled.json",
		}),
		pagefind(),
	],
});