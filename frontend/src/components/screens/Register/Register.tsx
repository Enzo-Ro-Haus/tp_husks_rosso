import { FormButton } from "../../ui/Buttons/FormButton/FormButton";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./Register.module.css";

export const Register = () => {
  return (
    <div className={style.containerPrincipalRegister}>
      <div>
        <Header />
      </div>
      <div className={style.containerForm}>
        <h2>REGISTER</h2>
        <form className={style.Form}>
          <div className={style.Input}>
            <input type="text" placeholder="Name" />
          </div>
          <div className={style.Input}>
            <input type="email" placeholder="Email" />
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
