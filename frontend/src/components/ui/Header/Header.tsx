import { useEffect, useState } from "react";
import { usuarioStore } from "../../../store/usuarioStore";
import styles from "./Header.module.css";
import { Link } from "react-router";

export const Header = () => {
  const usuarioActivo = usuarioStore((state) => state.usuarioActivo);
  const [ingreso, setIngreso] = useState("/register");
  const [cart, setCart] = useState("/register");

  useEffect(() => {
    if (usuarioActivo) {
      const rol = usuarioActivo?.rol;
      if (rol) {
        if (rol === "ADMIN") {
          setIngreso("/admin");
          setCart("/cart")
        } else if (rol === "CLIENTE") {
          setIngreso("/client");
          setCart("/cart")
        }
      }
    }
  }, [usuarioActivo]);

  return (
    <div className={styles.containerHeader}>
      <nav className={styles.leftNav}>
        <ul className={styles.list}>
          <li>
            <Link to="/catalog" className={styles.elementLink}>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/about" className={styles.elementLink}>
              About
            </Link>
          </li>
          <li>Discount</li>
        </ul>
      </nav>
      <h1 className={styles.title}>
        <Link to="/" className={styles.elementLink}>
          HUSKS
        </Link>
      </h1>
      <nav className={styles.rightNav}>
        <ul className={styles.list}>
          <li>Search</li>
          <li>
            <Link to={ingreso} className={styles.elementLink}>
              Account
            </Link>
          </li>
          <li>
            <Link to={cart} className={styles.elementLink}>
              Cart
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
