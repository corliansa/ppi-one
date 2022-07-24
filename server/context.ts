import { unstable_getServerSession } from "next-auth";
import { User } from "@prisma/client";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma, PrismaClient } from "../utils/prisma";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export type Context = {
	prisma: PrismaClient;
	user: User;
};

export const createContext = async (
	opts: trpcNext.CreateNextContextOptions
): Promise<Context> => {
	const { req, res } = opts;
	const session = await unstable_getServerSession(req, res, authOptions);

	const user = await prisma.user.findUniqueOrThrow({
		where: {
			email: session?.user?.email as string,
		},
	});

	return {
		prisma,
		user,
	};
};
