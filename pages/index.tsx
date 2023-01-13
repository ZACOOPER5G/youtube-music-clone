import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useContext, useEffect } from "react";
import MusicContext from "../context/MusicContext";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Thumbnail from "../components/Thumbnail";

const getToken = async () => {
  let response = await fetch(`https://accounts.spotify.com/api/token`, {
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
  //fetches user data
  let userResponse = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let spotifyUser = await userResponse.json();

  //fetches categories
  let categoriesResponse = await fetch(
    `https://api.spotify.com/v1/browse/categories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  let spotifyCategories = await categoriesResponse.json();

  // fetches featured playlists
  let featuredPlaylistsResponse = await fetch(
    `https://api.spotify.com/v1/browse/featured-playlists`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  let spotifyFeaturedPlaylists = await featuredPlaylistsResponse.json();

  return {
    props: {
      spotifyCategories: spotifyCategories.categories,
      spotifyFeaturedPlaylists: spotifyFeaturedPlaylists.playlists,
      spotifyUser,
    },
  };
};

export default function Home({
  spotifyCategories,
  spotifyFeaturedPlaylists,
  spotifyUser,
}: any) {
  const musicContext = useContext(MusicContext);
  const { categories, setCategories } = musicContext;

  useEffect(() => {
    if (typeof categories.items === "undefined" && spotifyCategories)
      setCategories(spotifyCategories);
  }, []);

  console.log(spotifyUser);

  return (
    <div className={styles.container}>
      <Head>
        <title>YouTube Music</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h1>Categories:</h1>
        <div className={styles.results}>
          {typeof categories.items !== "undefined"
            ? categories.items.map((category: any) => (
                <Thumbnail key={category?.id} style={styles.categories} name={category?.name} src={category.icons?.[0].url} />
              ))
            : "Loading..."}
        </div>
      </main>
    </div>
  );
}
