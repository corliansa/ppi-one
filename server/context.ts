import { User } from "@prisma/client";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma, PrismaClient } from "../utils/prisma";

export type Context = {
	prisma: PrismaClient;
	user: User;
};

export const createContext = async (
	opts: trpcNext.CreateNextContextOptions
): Promise<Context> => {
	const { req } = opts;
	const sessionToken =
		req.cookies?.["next-auth.session-token"] ||
		(req.headers?.["next-auth.session-token"] as string);

	const session = await prisma.session.findUniqueOrThrow({
		where: { sessionToken: sessionToken },
	});

	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: session.userId,
		},
	});

	return {
		prisma,
		user,
	};
};
