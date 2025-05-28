import styles from "./Header.module.css";
import { Link } from "react-router";

export const Header = () => {
  return (
    <div className={styles.containerHeader}>
      <nav className={styles.leftNav}>
        <ul className={styles.list}>
          <li><Link to="/Catalog" className={styles.elementLink}>Shop</Link></li>
          <li>About</li>
          <li>Discount</li>
        </ul>
      </nav>
      <h1 className={styles.title}><Link to="/" className={styles.elementLink}>HUSKS</Link></h1>
      <nav className={styles.rightNav}>
        <ul className={styles.list}>
          <li>Search</li>
          <li><Link to="/Login" className={styles.elementLink}>Account</Link></li>
          <li>Cart</li>
        </ul>
      </nav>
    </div>
  );
};
