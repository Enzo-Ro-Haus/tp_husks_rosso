import { useEffect } from "react";
import { getAllProductos } from "../../../http/productoHTTP";
import { productoStore } from "../../../store/prodcutoStore";
import { ListCard } from "../Card/ListCard/ListCard";
import styles from "./ShowElements.module.css";
import { ClotheCard } from "../Card/ClotheCard/ClotheCard";

export const ShowElements = () => {

  const productos = productoStore((state) => state.productos);
  const setArrayProductos = productoStore((state) => state.setArrayProductos);

  const getProductos = async () => {
    const data = await getAllProductos();
    if (data) setArrayProductos(data);
  };

  useEffect(() => {
    getProductos();
  }, []);

  return (
    <div className={styles.containerPrincipalShowElements}>
      <div className={styles.containerRecta}>
        <div className={styles.containerRectaTitulos}>
          <p className={styles.Product}>Product</p>
          <p className={styles.Quantity}>Quantity</p>
          <p className={styles.Price}>Price</p>
          <p className={styles.Delete}>Delete</p>
        </div>
        <div className={styles.Recta}></div>
      </div>
      <div className={styles.containerListCard}>
        {productos.length > 0 ? (
          productos
            .slice(0, 4)
            .map((el) => (
              <ClotheCard
                name={el.nombre}
                description={el.descripcion}
                price={el.precio}
              />
            ))
        ) : (
          <div>
            <h3>No hay productos</h3>
          </div>
        )}
      </div>
    </div>
  );
};
