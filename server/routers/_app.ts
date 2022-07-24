import { createRouter } from "../createRouter";
import superjson from "superjson";
import { z } from "zod";
import * as trpc from "@trpc/server";

export const appRouter = createRouter()
	.transformer(superjson)
	.query("hello", { resolve: () => "Hello, World!" })
	.middleware(async ({ ctx, next }) => {
		if (!ctx.user.role?.includes("admin")) {
			throw new trpc.TRPCError({
				code: "UNAUTHORIZED",
				message: "You are not authorized to access this resource.",
			});
		}
		return await next();
	})
	.query("getLinks", {
		resolve: async ({ ctx: { user, prisma } }) => {
			const links = await prisma.links.findMany({
				where: { createdBy: user.email as string },
			});

			return links;
		},
	})
	.mutation("createLink", {
		input: z.object({
			description: z.string().optional(),
			url: z.string().min(3).max(2048),
			slug: z.string().min(1).max(2048),
		}),
		resolve: async ({
			input: { description, url, slug },
			ctx: { user, prisma },
		}) => {
			const link = await prisma.links.create({
				data: {
					createdBy: user.email as string,
					description: description,
					url: url,
					slug: slug,
				},
			});

			return link;
		},
	})
	.mutation("deleteLink", {
		input: z.object({ id: z.string() }),
		resolve: async ({ input: { id }, ctx: { user, prisma } }) => {
			const link = await prisma.links.findUniqueOrThrow({
				where: { id: id as string },
			});

			if (link.createdBy !== user.email) {
				throw new Error("You do not have permission to delete this link");
			}

			const res = await prisma.links.delete({ where: { id: id as string } });

			return res;
		},
	});

export type AppRouter = typeof appRouter;
