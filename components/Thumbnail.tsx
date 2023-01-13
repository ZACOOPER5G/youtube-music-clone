import React from "react";
import Image from "next/image";

type ThumbnailProps = {
  style: any;
  name: string;
  src: string;
};

const Thumbnail = ({ style, name, src }: ThumbnailProps) => {
  return (
    <div className={style}>
      <Image
        alt="category icon"
        src={src}
        height={275}
        width={275}
        layout="responsive"
      />
      <li>{name}</li>
    </div>
  );
};

export default Thumbnail;
