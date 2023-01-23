import Image from "next/image";
import React from "react";
import Track from "./Track";

type PlaylistProps = {
  cover: string;
  name: string;
  type: string;
  artist: Array<string>;
  release: string;
  tracks: number;
};

const Playlist = ({ cover, name, type, artist, release, tracks }: PlaylistProps) => {
  return (
    <div>
      <div>
        <Image
          src={cover}
          layout="fluid"
          height={125}
          width={125}
          alt="cover image"
        />
        <div>
          <div>
            <h2>{name}</h2>
            <h3>{type}</h3>
            <h3>{artist}</h3>
            <h3>{release}</h3>
          </div>
          <div>
            <h3>{tracks} songs</h3>

          </div>
        </div>
      </div>
      <Track />
    </div>
  );
};

export default Playlist;
