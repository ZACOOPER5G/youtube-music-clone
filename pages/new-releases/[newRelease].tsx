import Head from "next/head";
import Link from "next/link";
import Playlist from "../../components/Playlist";

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

  // create paths for new releases
  let newReleasesResponse = await fetch(
    `https://api.spotify.com/v1/browse/new-releases`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  let spotifyNewReleases = await newReleasesResponse.json();

  let newReleaseParams = await spotifyNewReleases?.albums?.items?.map(
    (album: any) => {
      return {
        params: { newRelease: album.id },
      };
    }
  );

  return {
    paths: newReleaseParams,
    fallback: false,
  };
};

export const getStaticProps = async (context: any) => {
  let token = await getToken();

  const newReleaseId = await context.params.newRelease;
  const newReleaseResponse = await fetch(
    `https://api.spotify.com/v1/albums/${newReleaseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const newRelease = await newReleaseResponse.json();

  return {
    props: { newRelease: newRelease },
  };
};

const NewRelease = ({ newRelease }: any) => {
  console.log(newRelease);

  // newRelease.artists.map(artist => return artist)

  return (
    <>
      <Head>
        <title>YouTube Music | New Releases | {newRelease?.name}</title>
      </Head>
      <Playlist
        cover={newRelease.images[0].url}
        name={newRelease.name}
        type={newRelease.album_type}
        artist={newRelease.artists.map((artist: any) => {
          return artist.name;
        })}
        release={newRelease.release_date}
        tracks={newRelease.total_tracks}
      />
      <Link href="/">
        <button>Go back home</button>
      </Link>
    </>
  );
};

export default NewRelease;
