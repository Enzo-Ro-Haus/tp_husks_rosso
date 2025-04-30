import styles from "./ClotheCard.module.css";
import tshirt from '../../../../assets/landingimgs/image.png'

export const ClotheCard = () => {
  return (
    <div className={styles.containerPrincipalCard}>
      <img className={styles.cardImg} src={tshirt}></img>
      <div className={styles.cardInfo}>
        <div>
          <h3>Name</h3>
          <p>Descripcion</p>
        </div>
        <div>
          <p>$Price</p>
        </div>
      </div>
    </div>
  );
};
