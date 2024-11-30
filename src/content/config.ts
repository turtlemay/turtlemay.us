import { defineCollection, reference, z } from "astro:content";

export const collections = {
	posts: defineCollection({
		type: "content",
		schema: ({ image }) => z.object({
			draft: z.boolean().optional(),
			title: z.string(),
			description: z.string(),
			coverImage: image().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).optional(),
			series: reference("series").optional(),
		}),
	}),
	series: defineCollection({
		type: "content",
		schema: () => z.object({
			title: z.string(),
			posts: z.array(reference("posts")),
		}),
	}),
	archive: defineCollection({
		type: "content",
		schema: () => z.object({
			draft: z.boolean().optional(),
			title: z.string(),
			description: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
		}),
	}),
	status: defineCollection({
		type: "content",
		schema: () => z.object({
			draft: z.boolean().optional(),
			title: z.string().optional(),
			description: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
		}),
	}),
	books: defineCollection({
		type: "data",
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
		type: "data",
		schema: ({ image }) => z.object({
			name: z.string(),
			label: z.string(),
			thumb: image(),
			href: z.string(),
			title: z.string().optional(),
		}),
	}),
};