import Head from "next/head";
import styles from "../styles/Home.module.css";

export const getStaticProps = async () => {
	let response = await fetch("https://api.spotify.com/v1");
	let data = await response.json();

	return {
		props: {
			data: data,
		},
	};
};

export default function Home({ data }: any) {
  console.log(data);
	return (
		<div className={styles.container}>
			<Head>
				<title>YouTube Music</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>YOUTUBE</main>
		</div>
	);
}
