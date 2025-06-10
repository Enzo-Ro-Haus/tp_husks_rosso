import { Link } from "react-router";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <div className={styles.containerPrincipalFooter}>
      <div className={styles.containerSuperior}>
        <div className={styles.containerContactos}>
          <h2>Redes Sociales</h2>
          <div className={styles.containerRedesSociales} >
            <ul>
              <li><a href="https://www.facebook.com">Facebook</a></li>
              <li><a href="https://www.intagram.com">Instagram</a></li>
              <li><a href="https://bsky.app/">BlueSky</a></li>
            </ul>
          </div>
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
            <li>Shipping&Return</li>
            <li>Contacts</li>
          </ul>
        </div>
      </div>
      <div className={styles.separator}></div>
      <div className={styles.containerInferior}>
        <div className={styles.containerDerechos}>
          <p>2025</p>
          <p>HUSKS</p>
          <p>All Rights Reserved</p>
        </div>
        <div className={styles.containerPolicy}>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
