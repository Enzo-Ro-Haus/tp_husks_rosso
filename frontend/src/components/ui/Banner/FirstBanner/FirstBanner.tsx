import { Button } from "react-bootstrap";
import styles from "./FirstBanner.module.css";
import { Link } from "react-router";

export const FirstBanner = () => {
  return (
    <>
      <div className={styles.containerBanner}>
        <div className={styles.image}>
          <Button variant="outline-light" className={styles.ShopButton}>
            <Link to="/catalog" className={styles.ShopButtonLink}>
              SHOP <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </Button>
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
