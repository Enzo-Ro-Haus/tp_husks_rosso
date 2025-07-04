import { FabricBanner } from "../../ui/Banner/FabricBanner/FabricBanner";
import { FirstBanner } from "../../ui/Banner/FirstBanner/FirstBanner";
import { ProductionBanner } from "../../ui/Banner/ProductionBanner/ProductionBanner";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import { Showcase } from "../../ui/Showcase/Showcase";
import styles from "./Landingpage.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export const Landingpage = () => {
  return (
    <div className={styles.containerPrincipalLangdingPage}>
      <Container fluid>
        <Row>
          <Header />
        </Row>
        <Row>
          <FirstBanner />
        </Row>
        <Row>
          <Showcase />
        </Row>
        <Row >
          <ProductionBanner />
        </Row>
        <Row>
          <Showcase />
        </Row>
        <Row>
          <FabricBanner />
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
};
