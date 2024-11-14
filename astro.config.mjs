// @ts-check
import dotenv from "dotenv";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { photoDataAstroIntegration } from "./compile-photo-data";

dotenv.config({ path: [".env.local", ".env"] });
const { SITE } = process.env;
const { DEV_PORT } = process.env;

export default defineConfig({
	site: SITE,
	integrations: [
		mdx(),
		sitemap(),
		photoDataAstroIntegration(),
		pagefind(),
	],
	server: {
		port: Number(DEV_PORT || 4321),
		host: true,
	},
});