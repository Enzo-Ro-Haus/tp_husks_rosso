import { InfoCard } from '../../Card/InfoCard/InfoCard'
import styles from './ProductionBanner.module.css'

export const ProductionBanner = () => {
  return (
    <>
    <div className={styles.containerBanner}>
        <div className={styles.bannerInfo}>
          <h2>Informacion relevante</h2>
        </div>
        <div className={styles.containerCard}>
          <InfoCard/>
          <InfoCard/>
          <InfoCard/>
        </div>
    </div>
    </>
  )
}
