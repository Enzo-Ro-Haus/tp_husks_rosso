import { ShopButton } from "../../Buttons/ShopButton/ShopButton";
import styles from "./FirstBanner.module.css";

export const FirstBanner = () => {
  return (
    <>
      <div className={styles.containerBanner}>
        <div className={styles.image}>
          <ShopButton />
        </div>
        <div className={styles.bannerInfo}>
          <h2>FROM CANADA WITH LOVE</h2>
          <p>
            We are proudly made in Canada from knitting and dyeing, to cutting
            and sewing. We manufacture only the highest quality fleece and
            jersey products in Toronto, Canada. Shop our collection and support
            Canadian manufacturing.
          </p>
        </div>
      </div>
    </>
  );
};
