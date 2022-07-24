// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { email } = JSON.parse(req.body);

	const user = await prisma.users.findUnique({
		where: { email: email },
	});
	res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
	res.send(user);
}
