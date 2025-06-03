import styles from "./Header.module.css";
import { Link } from "react-router";

export const Header = () => {
  return (
    <div className={styles.containerHeader}>
      <nav className={styles.leftNav}>
        <ul className={styles.list}>
          <li><Link to="/catalog" className={styles.elementLink}>Shop</Link></li>
          <li><Link to="/about" className={styles.elementLink}>About</Link></li>
          <li>Discount</li>
        </ul>
      </nav>
      <h1 className={styles.title}><Link to="/" className={styles.elementLink}>HUSKS</Link></h1>
      <nav className={styles.rightNav}>
        <ul className={styles.list}>
          <li>Search</li>
          <li><Link to="/login" className={styles.elementLink}>Account</Link></li>
          <li><Link to="/cart" className={styles.elementLink}>Cart</Link></li>
        </ul>
      </nav>
    </div>
  )
};
