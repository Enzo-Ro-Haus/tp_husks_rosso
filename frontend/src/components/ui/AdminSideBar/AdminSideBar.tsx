import { NewProductButton } from "../Buttons/NewProductButton/NewProductButton";
//import style from "./AdminSideBar.module.css";

export const AdminSideBar = () => {
  return (
    <div>
        <h2>Admin</h2>
        <h3>Products/TSHIRT</h3>
      <div>
        <button>T-SHIRT</button>
      </div>
      <div>
        <button>SWEATSHIRT</button>
      </div>
      <div>
        <button>SHOES</button>
      </div>
      <NewProductButton/>
    </div>
  );
};
