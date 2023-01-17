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

  // create paths for categories
  let categoriesResponse = await fetch(
    `https://api.spotify.com/v1/browse/categories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  let spotifyCategories = await categoriesResponse.json();

  let categoriesParams = await spotifyCategories?.categories?.items?.map(
    (category: any) => {
      return {
        params: { categories: category.id },
      };
    }
  );

  return {
    paths: categoriesParams,
    fallback: false,
  };
};

export const getStaticProps = async (context: any) => {
  let token = await getToken();

  const categoriesId = await context.params.categories;
  console.log(categoriesId)
  const categoriesResponse = await fetch(
    `https://api.spotify.com/v1/browse/categories/${categoriesId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const category = await categoriesResponse.json();
  console.log("id ", categoriesId);
  console.log(category);

  return {
    props: { categories: category },
  };
};

const Categories = ({ categories }: any) => {
  return (
    <>
      <Head>
        <title>YouTube Music | New Releases | {categories?.name}</title>
      </Head>
      <div>{categories.name}</div>
      <Link href="/">
        <button>Go back home</button>
      </Link>
    </>
  );
};

export default Categories;
