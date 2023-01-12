import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useContext, useEffect } from "react";
import MusicContext from "../context/MusicContext";
import Image from "next/image";

const getToken = async () => {
	let response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${btoa(
				`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
			)}`,
		},
		body: "grant_type=client_credentials",
	});
	let data = await response.json();
	return data.access_token;
};

export const getServerSideProps = async () => {
	let token = await getToken();
	let response = await fetch(`https://api.spotify.com/v1/browse/categories`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	let data = await response.json();

	return {
		props: {
			data: data.categories,
		},
	};
};

export default function Home({ data }: any) {
	const musicContext = useContext(MusicContext);
	const { categories, setCategories } = musicContext;

	useEffect(() => {
		if (typeof categories.items === "undefined" && data) setCategories(data);
	}, [data]);

	console.log(data);

	return (
		<div className={styles.container}>
			<Head>
				<title>YouTube Music</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1>Categories:</h1>
				<div className={styles.results}>
					{typeof categories.items !== "undefined"
						? categories.items.map((category: any) => (
								<div className={styles.categories}>
									<li key={category?.id}>{category?.name}</li>
									<Image
										alt="category icon"
										src={category.icons?.[0].url}
										height={275}
										width={275}
									/>
								</div>
						  ))
						: "Loading..."}
				</div>
			</main>
		</div>
	);
}
