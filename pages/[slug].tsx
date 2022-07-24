import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { prisma } from "../utils/prisma";

const Slug: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Not found</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Path not found</h1>

				<p className={styles.description}>
					Go back to the{" "}
					<Link href="/">
						<a>home page</a>
					</Link>
				</p>
			</main>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const link = await prisma.links.findUnique({
		where: { slug: (context.query.slug as string)?.toLowerCase() },
	});

	if (link?.url)
		return {
			redirect: {
				permanent: false,
				destination: link.url,
			},
		};

	return { props: {} };
};

export default Slug;
