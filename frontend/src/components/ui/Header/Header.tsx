import { useEffect, useState } from "react";
import { usuarioStore } from "../../../store/usuarioStore";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

export const Header = () => {
  const navigate = useNavigate();
  const usuarioActivo = usuarioStore((state) => state.usuarioActivo);
  const setUsuario = usuarioStore((state) => state.setUsuarioActivo)
  const [ingreso, setIngreso] = useState("/register");
  const [cart, setCart] = useState("/login");
  const [log, setLog] = useState("LogIn");
  const usuario = usuarioStore((s) => s.usuarioActivo);
  const logout = usuarioStore((s) => s.logOut);

  const handleLogOut = () => {
    if (log === "LogOut") {
      Swal.fire({
        title: "¿Deseas cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "No",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Sesión cerrada",
            text: `¡Hasta luego, ${usuario?.nombre}!`,
            timer: 2000,
            showConfirmButton: false,
          });
          setUsuario(null);
          logout();
          navigate("/");
        }
      });
    } else if (log === "LogIn") {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (usuarioActivo) {
      const rol = usuarioActivo?.rol;
      setLog("LogOut");

      if (rol === "ADMIN") {
        setIngreso("/admin");
        setCart("/cart");
      } else if (rol === "CLIENTE") {
        setIngreso("/client");
        setCart("/cart");
      } else {
        // Si no hay rol definido
        setIngreso("/register");
        setCart("/login");
      }
    } else {
      setLog("LogIn");
      setIngreso("/register");
      setCart("/login"); // aquí también debe ser /login, no /register
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
          <li>Search</li>
        </ul>
      </nav>
      <h1 className={styles.titleMain}>
        <Link to="/" className={styles.elementLink}>
          HUSKS
        </Link>
      </h1>
      <nav className={styles.rightNav}>
        <ul className={styles.list}>
          <li>
            <Link to="/register" className={styles.elementLink}>
              Register
            </Link>
          </li>
          <li
            onClick={() => {
              if (usuarioActivo) {
                handleLogOut();
              } else {
                navigate("/login");
              }
            }}
            className={styles.elementLink}
          >
            {log}
          </li>
          <li>
            <Link to={cart} className={styles.elementLink}>
              Cart
            </Link>
          </li>
          <li>
            <Link
              to={
                usuario?.rol === "ADMIN"
                  ? "/admin"
                  : usuario?.rol === "CLIENTE"
                  ? "/client"
                  : "/login"
              }
              className={styles.elementLink}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1.5rem",
                  verticalAlign: "middle",
                  marginRight: "2px",
                }}
              >
                person
              </span>
              <div>
                {usuario?.nombre}
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
