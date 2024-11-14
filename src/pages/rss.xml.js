// @ts-check

import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { getCollection } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer } from "@astrojs/mdx";
import { SITE_TITLE, SITE_DESCRIPTION } from "../global";
import { createPhotoDateText, getPhotos } from "../photos";

const renderers = await loadRenderers([getContainerRenderer()]);
const container = await AstroContainer.create({ renderers });

/** @param {{ site: string }} context */
export async function GET(context) {
	const posts = await getCollection("posts", v => {
		return import.meta.env.PROD ? v.data.draft !== true : true;
	});
	const status = await getCollection("status", v => {
		return import.meta.env.PROD ? v.data.draft !== true : true;
	});
	const photos = await getPhotos();

	const items = [
		...posts.map(v => ({
			...v.data,
			title: `Blog Post ❖ ${v.data.title}`,
			description: v.data.description,
			pubDate: v.data.pubDate,
			link: `/posts/${v.slug}/`,
			content: v.data.description,
		})),
		...await Promise.all(status.map(async v => {
			const { Content } = await v.render();
			const html = await container.renderToString(Content);
			return {
				...v.data,
				title: v.data.title ?? createStatusItemTitle(v.data),
				description: createStatusItemTitle(v.data),
				pubDate: v.data.pubDate,
				link: `/posts/${v.slug}#${v.slug}`,
				content: sanitizeHtml(html, {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		})),
		...photos.map(v => ({
			title: `Photo taken on ${createPhotoDateText(v.date)} in ${v.location}`,
			description: v.caption ?? `Photo taken on ${createPhotoDateText(v.date)} in ${v.location}`,
			pubDate: v.date,
			link: `/photos/${v.basename}`,
			content: `<img src="${new URL(v.image.src, context.site)}" alt="${v.caption ?? ""}" title="${v.caption ?? ""}" /><p>${v.caption ?? ""}</p>`,
		})),
	];

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
		},
		customData: `<atom:link href="${new URL("/rss.xml", context.site)}" rel="self" type="application/rss+xml" />`,
		site: context.site,
		items: items.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
	});

	/** @param {typeof status[0]["data"]} data */
	function createStatusItemTitle(data) {
		const date = data.pubDate;
		const d = date.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" });
		const t = date.toLocaleTimeString("en-us", { hour: "numeric", minute: "numeric" });
		return `Status Update on ${d}, ${t}`;
	}
}