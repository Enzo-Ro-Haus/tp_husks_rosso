import styles from "./ClotheCard.module.css";
import tshirt from '../../../../assets/landings/image.png'

type ClotheCardProps = {
  name: string;
  description: string;
  price: number;
};

export const ClotheCard = ({ name, description, price }: ClotheCardProps) => {
  return (
    <div className={styles.containerPrincipalCard}>
      <img className={styles.cardImg} src={tshirt}></img>
      <div className={styles.cardInfo}>
        <div>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <div>
          <p>${price}</p>
        </div>
      </div>
    </div>
  );
};
