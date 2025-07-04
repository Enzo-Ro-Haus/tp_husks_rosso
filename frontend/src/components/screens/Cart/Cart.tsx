import { useNavigate } from "react-router";
import { useEffect } from "react";
import { CartSideBar } from "../../ui/CartSideBar/CartSideBar";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import styles from "./Cart.module.css";
import { usuarioStore } from "../../../store/usuarioStore";
import { cartStore } from "../../../store/cartStore";
import { ListCard } from "../../ui/Card/ListCard/ListCard";

export const Cart = () => {
  const navigate = useNavigate();
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  const orden = cartStore((s) => s.orden);
  const detalles = cartStore((s) => s.detalles);
  const setOrden = cartStore((s) => s.setOrden);
  const agregarDetalles = cartStore((s) => s.agregarDetalle);
  const setTotal = cartStore((s) => s.setTotal);
  const total = cartStore((s) => s.total);
  const detalleActivo = cartStore((s) => s.detalleActivo);
  const editarDetalleActivo = cartStore((s) => s.editarDetalle);

  useEffect(() => {
    if (!token) {
      console.warn("No hay token");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    setTotal(detalles);
  }, [detalles]);

  return (
    <div className={styles.containerPrincipalCart}>
      <Header />
      <div className={styles.containerBody}>
        <div className={styles.muestraDeElementos}>
          {detalles && detalles.length > 0 ? (
            detalles.map((d) => (
              <ListCard
                key={d.producto.id}
                variant="Products"
                id={d.producto.id || "NN"}
                name={d.producto.nombre}
                description={d.producto.descripcion}
                price={d.producto.precio}
                quantity={d.cantidad}
                sizes={d.producto.tallesDisponibles}
                onEdited={() => {}}
                onDeleted={() => {}}
                onRestored={() => {}}
              />
            ))
          ) : (
            <div>
              <h3>Este carrito está vacío, cambiemos eso</h3>
            </div>
          )}
        </div>
          <CartSideBar total={total} />
      </div>
      <Footer />
    </div>
  );
};
