import { FormButton } from "../../ui/Buttons/FormButton/FormButton";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./Login.module.css";

export const Login = () => {
  return (
    <div className={style.containerPrincipalLogin}>
      <div>
        <Header />
      </div>
      <div className={style.containerForm}>
        <h2>LOGIN</h2>
        <form className={style.Form}>
          <div className={style.Input}>
            <input type="text" placeholder="Name" />
          </div>
          <div className={style.Input}>
            <input type="password" placeholder="Email" />
          </div>
          <FormButton />
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
