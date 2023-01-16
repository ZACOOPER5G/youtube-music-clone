import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useState } from "react";
import MusicContext from "../context/MusicContext";

export default function App({ Component, pageProps }: AppProps) {
  const [categories, setCategories] = useState<any>([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  return (
    <MusicContext.Provider
      value={{
        categories,
        setCategories,
        featuredPlaylists,
        setFeaturedPlaylists,
        newReleases,
        setNewReleases,
      }}
    >
      <Component {...pageProps} />
    </MusicContext.Provider>
  );
}
