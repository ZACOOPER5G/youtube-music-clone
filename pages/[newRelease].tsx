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

  let newReleaseParams = await spotifyNewReleases?.albums?.items?.map((album: any) => {
    return {
      params: { newRelease: album.id },
    };
  });

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
  console.log("id ", newReleaseId)
  console.log(newRelease)

  return {
    props: { newRelease: newRelease },
  };
};

const NewRelease = ({ newRelease }: any) => {
  return (
    <>
      <Head>
        <title>YouTube Music | New Releases | {newRelease.name}</title>
      </Head>
      <div>{newRelease.name}</div>
      <Link href="/">
        <button>Go back home</button>
      </Link>
    </>
  );
};

export default NewRelease;
