import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";

const Links: NextPage = (props) => {
	const utils = trpc.useContext();
	const { data: session } = useSession();

	const { data, isLoading } = trpc.useQuery(["getLinks"]);
	const { mutateAsync: createLink, isLoading: loading } = trpc.useMutation(
		["createLink"],
		{
			onSuccess: () => utils.invalidateQueries(["getLinks"]),
		}
	);
	const { mutateAsync: deleteLink } = trpc.useMutation(["deleteLink"], {
		onSuccess: () => utils.invalidateQueries(["getLinks"]),
	});

	const [linkDescription, setLinkDescription] = React.useState("");
	const [linkUrl, setLinkUrl] = React.useState("");
	const [linkSlug, setLinkSlug] = React.useState("");

	return (
		<div className={styles.container}>
			<Head>
				<title>Links</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Links</h1>

				<div>
					<ul>
						{!isLoading &&
							data?.length! > 0 &&
							data?.map((link, i) => (
								<li key={i}>
									<a href={link.url}>
										({link.slug}): {link.url}
									</a>
									{link.description && <br />}
									{link.description}
									<button
										onClick={() => deleteLink({ id: link.id })}
										style={{ marginLeft: 4, background: "transparent" }}
									>
										x
									</button>
								</li>
							))}
					</ul>
				</div>

				{!!session && (
					<div style={{ display: "flex", flexDirection: "column" }}>
						<label>
							URL:{" "}
							<input
								type="text"
								value={linkUrl}
								placeholder="https://corliansa.xyz"
								onChange={(e) => setLinkUrl(e.target.value)}
							/>
							<br />
						</label>
						<label>
							Slug:{" "}
							<input
								type="text"
								value={linkSlug}
								placeholder="corliansa"
								onChange={(e) => setLinkSlug(e.target.value)}
							/>
							<br />
						</label>
						<label>
							Desc:{" "}
							<input
								type="text"
								value={linkDescription}
								placeholder="My personal website"
								onChange={(e) => setLinkDescription(e.target.value)}
							/>
							<br />
						</label>
						<button
							style={{ marginTop: 6 }}
							disabled={loading}
							onClick={async () => {
								const data = await createLink({
									url: linkUrl,
									slug: linkSlug,
									description: linkDescription,
								});
								alert(JSON.stringify(data, null, 2));
								setLinkUrl("");
								setLinkSlug("");
								setLinkDescription("");
							}}
						>
							Add
						</button>
					</div>
				)}
				<p className={styles.description}>
					Back to <Link href="/">PPI.One</Link>
				</p>
			</main>
		</div>
	);
};

export default Links;
