import Head from "next/head";
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

export const getStaticPaths = async () => {
  let token = await getToken();

  // create paths for featured playlists
let featuredPlaylistsResponse = await fetch(
  `https://api.spotify.com/v1/browse/featured-playlists`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
let spotifyFeaturedPlaylists = await featuredPlaylistsResponse.json();

  let featuredParams = await spotifyFeaturedPlaylists?.playlists?.items?.map(
    (featured: any) => {
      return {
        params: { featured: featured.id },
      };
    }
  );

  return {
    paths: featuredParams,
    fallback: false,
  };
};

export const getStaticProps = async (context: any) => {
  let token = await getToken();

  const featuredId = await context.params.featured;
  const featuredResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${featuredId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const playlist = await featuredResponse.json();

  return {
    props: { featured: playlist },
  };
};

const Featured = ({ featured }: any) => {
  return (
    <>
      <Head>
        <title>YouTube Music | New Releases | {featured?.name}</title>
      </Head>
      <div>{featured.name}</div>
      <Link href="/">
        <button>Go back home</button>
      </Link>
    </>
  );
};

export default Featured;
