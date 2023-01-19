import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useContext, useEffect } from "react";
import MusicContext from "../context/MusicContext";
import Navbar from "../components/Navbar";
import Thumbnail from "../components/Thumbnail";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";

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
  //fetches new release data
  let newReleasesResponse = await fetch(
    `https://api.spotify.com/v1/browse/new-releases`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  let spotifyNewReleases = await newReleasesResponse.json();

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
      spotifyNewReleases: spotifyNewReleases.albums,
    },
  };
};

export default function Home({
  spotifyCategories,
  spotifyFeaturedPlaylists,
  spotifyNewReleases,
}: any) {
  // importing global states
  const musicContext = useContext(MusicContext);
  const {
    categories,
    setCategories,
    featuredPlaylists,
    setFeaturedPlaylists,
    newReleases,
    setNewReleases,
  } = musicContext;

  console.log(categories);

  // setting global states
  useEffect(() => {
    if (typeof categories.items === "undefined" && spotifyCategories)
      setCategories(spotifyCategories);
    if (
      typeof featuredPlaylists.items === "undefined" &&
      spotifyFeaturedPlaylists
    )
      setFeaturedPlaylists(spotifyFeaturedPlaylists);
    if (typeof newReleases.items === "undefined" && spotifyNewReleases)
      setNewReleases(spotifyNewReleases);
  }, []);

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
        <h2>Categories</h2>
        <Carousel
          itemAriaLabel="yes"
          responsive={responsive}
          className={styles.results}
          infinite={true}
          slidesToSlide={5}
        >
          {typeof categories.items !== "undefined"
            ? categories.items.map((category: any) => (
                <Link href={`categories/${category?.id}`}>
                  <Thumbnail
                    key={category?.id}
                    style={styles.categories}
                    name={category?.name}
                    src={category.icons?.[0].url}
                  />
                </Link>
              ))
            : "Loading..."}
        </Carousel>
        <h2>Featured Playlists</h2>
        <Carousel
          itemAriaLabel="yes"
          responsive={responsive}
          className={styles.results}
          infinite={true}
          slidesToSlide={5}
        >
          {typeof featuredPlaylists.items !== "undefined"
            ? featuredPlaylists.items.map((featured: any) => (
                <Link href={`featured/${featured?.id}`}>
                  <Thumbnail
                    key={featured?.id}
                    style={styles.categories}
                    name={featured?.name}
                    src={featured.images?.[0].url}
                    description={featured?.description}
                  />
                </Link>
              ))
            : "Loading..."}
        </Carousel>
        <h2>New Releases</h2>
        <Carousel
          itemAriaLabel="yes"
          responsive={responsive}
          className={styles.results}
          infinite={true}
          slidesToSlide={5}
        >
          {typeof newReleases.items !== "undefined"
            ? newReleases.items.map((release: any) => (
                <Link href={`newRelease/${release?.id}`}>
                  <Thumbnail
                    key={release?.id}
                    style={styles.categories}
                    name={release?.name}
                    src={release?.images?.[0]?.url}
                  />
                </Link>
              ))
            : "Loading..."}
        </Carousel>
      </main>
    </div>
  );
}
