// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { email, description, url, slug } = JSON.parse(req.body);

	const user = await prisma.user.findUniqueOrThrow({
		where: { email: email },
	});

	if (!user) {
		res.status(400).send({ error: "Unauthorized" });
		return;
	}
	const link = await prisma.links.create({
		data: {
			createdBy: email,
			description: description,
			url: url,
			slug: slug,
		},
	});
	res.send(link);
}
