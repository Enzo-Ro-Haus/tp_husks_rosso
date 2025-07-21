import { useEffect, useState, forwardRef } from "react";
import { usuarioStore } from "../../../store/usuarioStore";
import styles from "./Header.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Col, Container, Row } from "react-bootstrap";

export type Props = {
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
};

export const Header = forwardRef<HTMLDivElement, Props>(
  ({ showFilters, setShowFilters }, ref) => {
    const navigate = useNavigate();
    const usuarioActivo = usuarioStore((state) => state.usuarioActivo);
    const setUsuario = usuarioStore((state) => state.setUsuarioActivo);
    const [ingreso, setIngreso] = useState("/register");
    const [cart, setCart] = useState("/login");
    const [log, setLog] = useState("LogIn");
    const usuario = usuarioStore((s) => s.usuarioActivo);
    const logout = usuarioStore((s) => s.logOut);
    const location = useLocation();

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
        const rol = usuarioActivo.rol;
        setLog("LogOut");

        if (rol === "ADMIN") {
          setIngreso("/admin");
          setCart("/cart");
        } else if (rol === "CLIENTE") {
          setIngreso("/client");
          setCart("/cart");
        } else {
          setIngreso("/register");
          setCart("/login");
        }
      } else {
        setLog("LogIn");
        setIngreso("/register");
        setCart("/login");
      }
    }, [usuarioActivo]);

    return (
      <div className={styles.containerHeader} ref={ref}>
        <Container fluid className="h-100">
          <Row className="h-100 w-100 align-items-center justify-content-evenly mx-1">
            <Col className="d-flex gap-5 justify-content-start align-items-center">
              <Link to="/catalog" className={styles.elementLink}>
                Shop
              </Link>
              <Link to="/about" className={styles.elementLink}>
                About
              </Link>
              {location.pathname === "/catalog" && setShowFilters && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  style={{ minWidth: 80 }}
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  aria-controls="filterBar"
                >
                  <span className="material-symbols-outlined align-middle" style={{ fontSize: 18, verticalAlign: 'middle' }}>search</span>
                  <span className="ms-1 align-middle">Search</span>
                </button>
              )}
            </Col>

            <Col className="d-flex justify-content-center align-items-center">
              <Link to="/" className={styles.elementLinkTitle}>
                HUSKS
              </Link>
            </Col>

            <Col className="d-flex gap-5 justify-content-end align-items-center">
              {/* Sólo mostramos Register si NO hay usuario activo */}
              {!usuarioActivo && (
                <Link to="/register" className={styles.elementLink}>
                  Register
                </Link>
              )}

              <span
                onClick={usuarioActivo ? handleLogOut : () => navigate("/login")}
                className={styles.elementLink}
                style={{ cursor: "pointer" }}
              >
                {log}
              </span>

              <Link to={cart} className={styles.elementLink}>
                Cart
              </Link>

              <Link
                to={
                  usuario?.rol === "ADMIN"
                    ? "/admin"
                    : usuario?.rol === "CLIENTE"
                    ? "/client"
                    : "/login"
                }
                className={`${styles.elementLink} ${styles.personLink}`}
              >
                <span className="material-symbols-outlined">person</span>
                {usuario?.nombre ?? ""}
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
);
Header.displayName = 'Header';

