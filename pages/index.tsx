import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useContext, useEffect } from "react";
import MusicContext from "../context/MusicContext";
import Navbar from "../components/Navbar";
import Thumbnail from "../components/Thumbnail";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

  // importing global states
  const musicContext = useContext(MusicContext);
  const { categories, setCategories, featuredPlaylists, setFeaturedPlaylists } = musicContext;

  // setting global states
  useEffect(() => {
    if (typeof categories.items === "undefined" && spotifyCategories)
      setCategories(spotifyCategories);
    if (
      typeof featuredPlaylists.items === "undefined" &&
      spotifyFeaturedPlaylists
    )
      setFeaturedPlaylists(spotifyFeaturedPlaylists);
  }, []);

  console.log(featuredPlaylists);

  // responsive config for carousel component
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>YouTube Music</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h1>Categories:</h1>
        <Carousel
          itemAriaLabel="yes"
          responsive={responsive}
          className={styles.results}
          infinite={true}
        >
          {typeof categories.items !== "undefined"
            ? categories.items.map((category: any) => (
                <Thumbnail
                  key={category?.id}
                  style={styles.categories}
                  name={category?.name}
                  src={category.icons?.[0].url}
                />
              ))
            : "Loading..."}
        </Carousel>
      </main>
    </div>
  );
}
