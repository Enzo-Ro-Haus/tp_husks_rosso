
import { ViewAllButton } from "../Buttons/ViewAllButton/ViewAllButton";
import { ClotheCard } from "../Card/ClotheCard/ClotheCard";
import styles from "./Showcase.module.css";
import { productoStore } from "../../../store/prodcutoStore";

//Puede que falte el useEffect

export const Showcase = () => {
  const productos = productoStore((s) => s.productos);
  
  return ( 
    <div className={styles.containerPincipalShowcase}>
      <div className={styles.containerTitleButton}>
        <h2 className={styles.containerTitle}>CATALOG</h2>
        <div className={styles.buttonContainer}>
          <ViewAllButton />
        </div>
      </div>
      <div className={styles.containerClotheCards}>
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
