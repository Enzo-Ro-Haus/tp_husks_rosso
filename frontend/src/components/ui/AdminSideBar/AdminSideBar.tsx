import style from "./AdminSideBar.module.css";

interface AdminSideBarProps {
  view:
    | "Products"
    | "Users"
    | "Categories"
    | "Types"
    | "Sizes"
    | "Addresses"
    | "Orders";
  onChangeView: (
    view:
      | "Products"
      | "Users"
      | "Categories"
      | "Types"
      | "Sizes"
      | "Addresses"
      | "Orders"
  ) => void;
}

export const AdminSideBar = ({ view, onChangeView }: AdminSideBarProps) => {
  return (
    <div className={style.containerSideBar}>
      <h2 className={style.containerSideBarTitle}>ADMIN</h2>
      <button className={style.clothButton}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "1.5rem", verticalAlign: "middle", marginRight: "2px" }}
        >
          add_circle
        </span>
        {view}
      </button>
      <div className={style.containerButtons}>
        <button
          className={`${style.clothButton} ${
            view === "Products" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Products")}
        >
          Products
        </button>

        <button
          className={`${style.clothButton} ${
            view === "Users" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Users")}
        >
          Users
        </button>

        <button
          className={`${style.clothButton} ${
            view === "Categories" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Categories")}
        >
          Categories
        </button>

        <button
          className={`${style.clothButton} ${
            view === "Types" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Types")}
        >
          Types
        </button>

        <button
          className={`${style.clothButton} ${
            view === "Sizes" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Sizes")}
        >
          Sizes
        </button>

        <button
          className={`${style.clothButton} ${
            view === "Addresses" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Addresses")}
        >
          Addresses
        </button>

        <button
          className={`${style.clothButton} ${
            view === "Orders" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Orders")}
        >
          Orders
        </button>
      </div>
    </div>
  );
};
