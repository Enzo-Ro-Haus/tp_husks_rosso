import { ListCard } from "../Card/ListCard/ListCard"
import styles from "./ShowElements.module.css"

export const ShowElements = () => {
  return (
    <div className={styles.containerPrincipalShowElements}>
        <div className={styles.containerRecta}>
            <div className={styles.containerRectaTitulos}>
                <p className={styles.Product}>Product</p>
                <p className={styles.Quantity}>Quantity</p>
                <p className={styles.Price}>Price</p>
                <p className={styles.Edit}>Edit</p>
                <p className={styles.Delete}>Delete</p>
            </div>
            <div className={styles.Recta}></div>
        </div>
        <div className={styles.containerListCard}>
          <ListCard />
          <ListCard />
          <ListCard />
          <ListCard />
          <ListCard />
          <ListCard />
          <ListCard />
          <ListCard />
          <ListCard />
        </div>
    </div>
  )
}
