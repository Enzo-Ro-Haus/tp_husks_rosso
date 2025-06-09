import { useEffect } from "react";
import { getAllProductos } from "../../../http/productoHTTP";
import { ViewAllButton } from "../Buttons/ViewAllButton/ViewAllButton";
import { ClotheCard } from "../Card/ClotheCard/ClotheCard";

import styles from "./Showcase.module.css";
import { productoStore } from "../../../store/prodcutoStore";

export const Showcase = () => {

  return (
    <div className={styles.containerPincipalShowcase}>
      <div className={styles.containerTitleButton}>
        <h2 className={styles.containerTitle}>Catalog</h2>
        <div className={styles.buttonContainer}>
          <ViewAllButton />
        </div>
      </div>
      <div className={styles.containerClotheCards}>
        
      </div>
    </div>
  );
};
