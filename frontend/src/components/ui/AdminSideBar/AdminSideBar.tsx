import { useEffect, useState } from "react";
import style from "./AdminSideBar.module.css";
import { usuarioStore } from "../../../store/usuarioStore";
import { IValues } from "../../../types/IUsuario";
import { registrarUsuario } from "../../../http/usuarioHTTP";
import { useNavigate } from "react-router-dom";
import { CreateButtonBootstrap } from "../Buttons/CreateButton/CreateButtonBootstrap";

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
  name: string;
  onUserCreated?: () => void;
  onProductCreated?: () => void;
  onCategoryCreated?: () => void;
  onTypeCreated?: () => void;
  onSizeCreated?: () => void;
  onAddressCreated?: () => void;
  onOrderCreated?: () => void;
}

export const AdminSideBar = ({
  view,
  onChangeView,
  name,
  onUserCreated,
  onProductCreated,
  onCategoryCreated,
  onTypeCreated,
  onSizeCreated,
  onAddressCreated,
  onOrderCreated,
}: AdminSideBarProps) => {
  const navigate = useNavigate();

  const [popUp, setPopUp] = useState(false);

  const handlePopUp = () => {
    setPopUp(!popUp);
  };

  // Función para determinar qué callback usar según la vista
  const getOnCreatedCallback = () => {
    switch (view) {
      case "Products":
        return onProductCreated;
      case "Users":
        return onUserCreated;
      case "Categories":
        return onCategoryCreated;
      case "Types":
        return onTypeCreated;
      case "Sizes":
        return onSizeCreated;
      case "Addresses":
        return onAddressCreated;
      case "Orders":
        return onOrderCreated;
      default:
        return undefined;
    }
  };

  const setUsuarioActivo = usuarioStore((state) => state.setUsuarioActivo);
  const setToken = usuarioStore((state) => state.setToken);
  const usuario = usuarioStore((state) => state.usuarioActivo);
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  const handleSubmit = async (values: IValues) => {
    const nuevoUsuario: IValues = {
      nombre: values.nombre.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
    };

    const info = await registrarUsuario(nuevoUsuario);

    if (!info?.token) {
      console.warn("❌ Registro fallido");
      return;
    }

    console.log("✅ Usuario creado");

    if (onUserCreated) {
      onUserCreated();
    }

    setPopUp(false);
  };

  useEffect(() => {
    console.log("✅ Register montado");
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <>
      {popUp && (
        <CreateButtonBootstrap
          view={view}
          onClose={() => setPopUp(false)}
          onCreated={getOnCreatedCallback()}
        />
      )}

      <div className={style.containerSideBar}>
        <h2 className={style.containerSideBarTitle}>{"ADMIN: " + name}</h2>
        <button className={style.clothButtonAdd} onClick={handlePopUp}>
          {`Add ${view}`}
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
    </>
  );
};
