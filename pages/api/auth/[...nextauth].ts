import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "../../../utils/prisma";

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		}),
		// ...add more providers here
	],
	secret: process.env.SECRET as string,
};

export default NextAuth(authOptions);
