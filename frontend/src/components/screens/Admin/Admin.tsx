import { AdminSideBar } from "../../ui/AdminSideBar/AdminSideBar";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import styles from "./Admin.module.css";

export const Admin = () => {
  return (
    <div className={styles.containerPrincipalAdmin}>
      <div>
        <Header />
      </div>
      <div className={styles.containerAdminUi}>
        <AdminSideBar/>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
