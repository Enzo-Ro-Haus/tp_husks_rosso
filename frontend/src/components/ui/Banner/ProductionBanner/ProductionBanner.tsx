import { InfoCard } from "../../Card/InfoCard/InfoCard";
import styles from "./ProductionBanner.module.css";

export const ProductionBanner = () => {
  return (
    <>
      <div className={styles.containerBanner}>
        <h2>OUR PRODUCTION:</h2>
        <div className={styles.containerCard}>
          <InfoCard
            img="src/assets/landings/info.png"
            title="KNITTING MILL"
            content="Our parent company Roopa Knitting Mills has been
manufacturing world class knit textiles for the last
30 years in Toronto, Canada. Our knowledge base and
state of the art knitting machines allow us to create
the highest quality fabrics for every product in our
line."
          />
          <InfoCard
            img="src/assets/landings/quimic.png"
            title="DYE HOUSE"
            content="Milling fabrics to the highest quality specifications
is only the first part of our process. Our dye house
is located a few meters from the mill and allows us
the opportunity to be hands on with our products
every step of the way."
          />
          <InfoCard
            img="src/assets/landings/worker.png"
            title="SEWING FACTORY"
            content="Located only 15 km from the mill, our sewing
operation is where art and manufacturing connect with
unparalleled construction techniques and an extreme
attention to detail. Every product is carefully sewn
to the highest quality specification and quality
assured before shipping to you."
          />
        </div>
      </div>
    </>
  );
};
