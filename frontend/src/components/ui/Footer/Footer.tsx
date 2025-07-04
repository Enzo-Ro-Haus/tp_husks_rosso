import { Container, Row, Col } from "react-bootstrap";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.containerPrincipalFooter}>
      <Container fluid className={styles.containerSuperior}>
        <Row>
          <Col md={4} className={styles.containerContactos}>
            <h2>SOCIAL MEDIA</h2>
            <ul className={styles.containerRedesSociales}>
              <li><a href="https://www.facebook.com">Facebook</a></li>
              <li><a href="https://www.instagram.com">Instagram</a></li>
              <li><a href="https://bsky.app/">BlueSky</a></li>
            </ul>
          </Col>

          <Col md={4} className={styles.containerCenter}>
            <h1>HUSKS</h1>
            <p>
              Husks is a factory brand produced by Ronpa Knitting Mills, the
              makers of the world's highest quality knit fabrics and apparel.
            </p>
          </Col>

          <Col md={4} className={styles.containerInformacion}>
            <h2>INFO</h2>
            <ul>
              <li>FAQs</li>
              <li>Shipping & Return</li>
              <li>Contacts</li>
            </ul>
          </Col>
        </Row>
      </Container>

      <div className={styles.separator}></div>

      <Container fluid className={styles.containerInferior}>
        <Row className="justify-content-between">
          <Col md="auto" className={styles.containerDerechos}>
            <p>2025</p>
            <p>HUSKS</p>
            <p>All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

