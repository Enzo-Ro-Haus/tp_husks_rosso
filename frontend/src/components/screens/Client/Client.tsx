import { ShowElements } from "../../ui/ShowElements/ShowElements";
import { AdminSideBar } from "../../ui/AdminSideBar/AdminSideBar";
import styles from "./Client.module.css";
import { Header } from "../../ui/Header/Header";
import { Footer } from "../../ui/Footer/Footer";

export const Client = () => {
  return (
        <div className={styles.containerPrincipalClient}>
      <div>
        <Header />
      </div>
      <div className={styles.containerClientUi}>
        <AdminSideBar />
        <ShowElements />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
