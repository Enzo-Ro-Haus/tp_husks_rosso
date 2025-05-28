import { AdminSideBar } from "../../ui/AdminSideBar/AdminSideBar";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import { ShowElements } from "../../ui/ShowElements/ShowElements";
import styles from "./Admin.module.css";

export const Admin = () => {
  return (
    <div className={styles.containerPrincipalAdmin}>
      <div>
        <Header />
      </div>
      <div className={styles.containerAdminUi}>
        <AdminSideBar />
        <ShowElements />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
