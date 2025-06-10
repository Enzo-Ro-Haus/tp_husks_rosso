import { Link } from 'react-router'
import styles from './ShopButton.module.css'


export const ShopButton = () => {
  return (
        <button className={styles.shopButton}><Link to="/catalog">SHOP <span className="material-symbols-outlined">
        arrow_right_alt
        </span></Link></button>
  )
}
