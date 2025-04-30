import { FabricBanner } from "../../ui/Banner/FabricBanner/FabricBanner";
import { FirstBanner } from "../../ui/Banner/FirstBanner/FirstBanner";
import { ProductionBanner } from "../../ui/Banner/ProductionBanner/ProductionBanner";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import { Showcase } from "../../ui/Showcase/Showcase";
import styles from '../GenericStyle.module.css';

export const Landingpage = () => {
  return (
    <div className={styles.containerPrincipalPage}>
      <Header/>
      <FirstBanner/>
      <Showcase/>
      <ProductionBanner/>
      <Showcase/>
      <FabricBanner/>
      <Footer/>
    </div>
  );
};
