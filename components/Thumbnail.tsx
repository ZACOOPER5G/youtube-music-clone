import React from "react";
import Image from "next/image";
import styles from "../styles/Thumbnail.module.css";

type ThumbnailProps = {
  style: any;
  name: string;
  src: string;
  description?: string
};

const Thumbnail = ({ style, name, src, description }: ThumbnailProps) => {
  return (
    <div className={style}>
      <Image
        alt="category icon"
        src={src}
        height={275}
        width={275}
        layout="responsive"
      />
      <h3 className={styles.text}>{name}</h3>
      <p className={styles.text}>{description && description}</p>
    </div>
  );
};

export default Thumbnail;
