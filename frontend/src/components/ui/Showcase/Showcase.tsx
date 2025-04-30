import { ViewAllButton } from "../Buttons/ViewAllButton/ViewAllButton";
import { ClotheCard } from "../Card/ClotheCard/ClotheCard";

import styles from "./Showcase.module.css";

export const Showcase = () => {
  return (
    <div className={styles.containerPincipalShowcase}>
      <div className={styles.containerTitleButton}>
        <h2 className={styles.containerTitle}>New T-shirts...</h2>
        <div className={styles.buttonContainer}>
          <ViewAllButton />
        </div>
      </div>
      <div className={styles.containerClotheCards}>
        <ClotheCard/>
        <ClotheCard/>
        <ClotheCard/>
        <ClotheCard/>
      </div>
    </div>
  );
};
