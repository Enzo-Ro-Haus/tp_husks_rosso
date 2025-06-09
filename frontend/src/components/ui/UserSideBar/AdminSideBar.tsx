import { NewProductButton } from "../Buttons/NewProductButton/NewProductButton";
import style from "./AdminSideBar.module.css";

export const AdminSideBar = () => {
  return (
    <div className={style.containerSideBar}>
      <h2 className={style.containerSideBarTitle}>Admin</h2>
      <h3 className={style.containerSideBarSubTitle}>Products/ TSHIRT</h3>
      <div className={style.containerButtons}>
        <div className={style.containerButton}>
          <button className={style.clothButton}>T-SHIRT</button>
        </div>
        <div className={style.containerButton}>
          <button className={style.clothButton}>SWEATSHIRT</button>
        </div>
        <div className={style.containerButton}>
          <button className={style.clothButton}>SHOES</button>
        </div>
      </div>
      <NewProductButton />
    </div>
  );
};
