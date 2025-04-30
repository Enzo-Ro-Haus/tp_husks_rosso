import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "../GenericStyle.module.css";

export const Login = () => {
  return (
    <div className={style.containerPrincipalPage}>
      <Header />
      <div className={style.containerForm}>
        <form>
          <label htmlFor="">Email</label>
          <input type="text" />
          <label htmlFor="">Password</label>
          <input type="password" />
        </form>
      </div>
      <Footer />
    </div>
  );
};
