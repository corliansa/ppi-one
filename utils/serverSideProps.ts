import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export const getSessionServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await unstable_getServerSession(
		ctx.req,
		ctx.res,
		authOptions
	);
	return {
		props: {
			session,
		},
	};
};
