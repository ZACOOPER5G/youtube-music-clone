import Image from "next/image";
import React from "react";
import Track from "./Track";

type PlaylistProps = {
  cover: string;
  name: string;
  type: string;
  artist?: Array<string>;
  release: string;
  totalTracks: number;
  tracks: Array<any>
};

const Playlist = ({ cover, name, type, artist, release, totalTracks, tracks }: PlaylistProps) => {
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
            <h3>{totalTracks} songs</h3>
          </div>
        </div>
      </div>
      {tracks.map((track: any) => (
        <Track track={track} key={track.id || track.track.id} />
      ))}
    </div>
  );
};

export default Playlist;
