import React from "react";
import Image from "next/image";

type ThumbnailProps = {
  key: string;
  style: any;
  name: string;
  src: string;
};

const Thumbnail = ({ key, style, name, src }: ThumbnailProps) => {
  return (
    <div key={key} className={style}>
      <li>{name}</li>
      <Image
        alt="category icon"
        src={src}
        height={275}
        width={275}
        layout="responsive"
      />
    </div>
  );
};

export default Thumbnail;
