// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { photoDataAstroIntegration } from "./compile-photo-data";

export default defineConfig({
	site: "https://www.turtlemay.us/",
	integrations: [
		mdx(),
		sitemap(),
		photoDataAstroIntegration(),
		pagefind(),
	],
});