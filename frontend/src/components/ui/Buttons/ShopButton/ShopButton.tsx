import styles from './ShopButton.module.css'


export const ShopButton = () => {
  return (
        <button className={styles.shopButton}>SHOP <span className="material-symbols-outlined">
        arrow_right_alt
        </span></button>
  )
}
