import styles from "./InfoCard.module.css";
import production from "../../../../assets/landingimgs/production.png";

export const InfoCard = () => {
  return (
    <div className={styles.containerPrincipalCard}>
      <img className={styles.cardImg} src={production}></img>
      <div className={styles.cardInfo}>
        <div>
          <h3>Title</h3>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit
            asperiores inventore, fugiat deserunt, vitae obcaecati.
          </p>
        </div>
      </div>
    </div>
  );
};
