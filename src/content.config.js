import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
	posts: defineCollection({
		loader: glob({
			pattern: "**/[^_]*.{md,mdx}",
			base: "./src/collections/posts"
		}),
		schema: ({ image }) => z.object({
			draft: z.boolean().optional(),
			title: z.string(),
			description: z.string(),
			coverImage: image().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).optional(),
			series: reference("series").optional(),
			originalUrl: z.string().url().optional(),
		}),
	}),
	series: defineCollection({
		loader: glob({
			pattern: "**/[^_]*.{md,mdx}",
			base: "./src/collections/series"
		}),
		schema: () => z.object({
			title: z.string(),
			posts: z.array(reference("posts")),
		}),
	}),
	archive: defineCollection({
		loader: glob({
			pattern: "**/[^_]*.{md,mdx}",
			base: "./src/collections/archive"
		}),
		schema: () => z.object({
			draft: z.boolean().optional(),
			title: z.string(),
			description: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
		}),
	}),
	status: defineCollection({
		loader: glob({
			pattern: "**/[^_]*.{md,mdx}",
			base: "./src/collections/status"
		}),
		schema: () => z.object({
			draft: z.boolean().optional(),
			title: z.string().optional(),
			description: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
		}),
	}),
	books: defineCollection({
		loader: glob({
			pattern: "**/[^_]*.{yml,yaml}",
			base: "./src/collections/books"
		}),
		schema: ({ image }) => z.object({
			title: z.string(),
			author: z.string(),
			year: z.string(),
			description: z.string(),
			cover: image(),
			url: z.string().url(),
		}),
	}),
	games: defineCollection({
		loader: glob({
			pattern: "**/[^_]*.{yml,yaml}",
			base: "./src/collections/games"
		}),
		schema: ({ image }) => z.object({
			title: z.string(),
			author: z.string(),
			year: z.string(),
			description: z.string(),
			cover: image(),
			url: z.string().url(),
		}),
	}),
	links: defineCollection({
		loader: glob({
			pattern: "**/[^_]*.{yml,yaml}",
			base: "./src/collections/links"
		}),
		schema: ({ image }) => z.object({
			name: z.string(),
			label: z.string(),
			thumb: image(),
			href: z.string(),
			title: z.string().optional(),
		}),
	}),
};