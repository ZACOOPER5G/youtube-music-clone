import Image from "next/image";
import styles from "../styles/Nav.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div>
        <Image
          alt="logo"
          src="/images/youtube-logo.svg"
          height={24}
          width={80}
        />
      </div>
      <div>
        <ul className={styles.navlinks}>
          <li>Home</li>
          <li>Explore</li>
          <li>Library</li>
        </ul>
      </div>
      <div className={styles.user}>
          User
      </div>
    </nav>
  );
};

export default Navbar;
