import styles from "./FabricBanner.module.css";

export const FabricBanner = () => {
  return (
    <>
      <div className={styles.containerBanner}>
        <div className={styles.image}>
          <div className={styles.info}>
            <h2>OUR FABRICS</h2>
            <p>
              All of our garments are manufactured in Toronto, Canada. We are
              uniquely able to mill and dye our own fabrics to the highest
              quality specifications required for each garment in the
              collection.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
