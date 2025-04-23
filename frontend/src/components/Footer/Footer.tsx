import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <div className={styles.containerPrincipal}>
      <footer className={styles.containerFooter}>
        <div className={styles.containerSuperior}>
          <div className={styles.containerContactos}>
            <h2>Redes Sociales</h2>
            <ul>
              <li>Facebook</li>
              <li>Instagram</li>
              <li>BlueSky</li>
            </ul>
          </div>
          <div className={styles.containerCenter}>
            <h1>Husks</h1>
            <p>
              Husks is a factory brand produced by Ronpa Knitting Mills, the
              makers of the world's highest quality knit fabrics and apparel.
            </p>
          </div>
          <div className={styles.containerInformacion}>
            <h2>Informacion</h2>
            <ul>
              <li>FAQs</li>
              <li>Shipping&return</li>
              <li>Contacts</li>
            </ul>
          </div>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.containerInferior}>
          <ul className={styles.containerDerechos}>
            <li>2025</li>
            <li>HUSKS</li>
            <li>All Rights Reserved</li>
          </ul>
          <ul className={styles.containerPolicy}>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};
