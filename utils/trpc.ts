import type { AppRouter } from "../server/routers/_app";
import { createReactQueryHooks } from "@trpc/react";
import { createTRPCClient } from "@trpc/react";
import superjson from "superjson";

export const trpc = createReactQueryHooks<AppRouter>();
export const trpcClient = createTRPCClient<AppRouter>({
	url: "/api/trpc",
	transformer: superjson,
});
