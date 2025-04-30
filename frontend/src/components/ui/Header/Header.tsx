import styles from "./Header.module.css";

export const Header = () => {
  return (
    <div className={styles.containerHeader}>
      <nav className={styles.leftNav}>
        <ul className={styles.list}>
          <li>Shop</li>
          <li>About</li>
          <li>Discount</li>
        </ul>
      </nav>
      <h1 className={styles.title}>HUSKS</h1>
      <nav className={styles.rightNav}>
        <ul className={styles.list}>
          <li>Search</li>
          <li>Account</li>
          <li>Cart</li>
        </ul>
      </nav>
    </div>
  );
};
