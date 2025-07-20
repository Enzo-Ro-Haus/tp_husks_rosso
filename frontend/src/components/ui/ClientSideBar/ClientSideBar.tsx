import style from "./ClientSideBar.module.css";

interface ClientSideBarProps {
  view: "Client" | "Orders" | "Address";
  onChangeView: (view: "Client" | "Orders" | "Address") => void;
  name: string;
}

export const ClientSideBar = ({ view, onChangeView, name }: ClientSideBarProps) => {

  return (
    <div className={style.containerSideBar}>
      <h2 className={style.containerSideBarTitle}>{"USER: " + name}</h2>
      <div className={style.containerButtons}>
        <button
          className={`${style.clothButton} ${
            view === "Client" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Client")}
        >
          My user
        </button>

        <button
          className={`${style.clothButton} ${
            view === "Orders" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Orders")}
        >
          My orders
        </button>

        <button
          className={`${style.clothButton} ${
            view === "Address" ? style.activeBtn : ""
          }`}
          onClick={() => onChangeView("Address")}
        >
          My address
        </button>
      </div>
    </div>
  );
};
