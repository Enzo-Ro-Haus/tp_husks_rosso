import styles from "./Client.module.css";
import { Header } from "../../ui/Header/Header";
import { Footer } from "../../ui/Footer/Footer";
import { ClientSideBar } from "../../ui/ClientSideBar/ClientSideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usuarioStore } from "../../../store/usuarioStore";
import { ordenStore } from "../../../store/ordenStore";
import { ListCard } from "../../ui/Card/ListCard/ListCard";
import { getAllUsuarios } from "../../../http/usuarioHTTP";
import { getAllOrdenes } from "../../../http/ordenHTTPS";

export const Client = () => {
  const navigate = useNavigate();

  const usuario = usuarioStore((s) => s.usuarioActivo);
  const token = usuarioStore((s) => s.usuarioActivo?.token);
  const setArrayUsuarios = usuarioStore((s) => s.setArrayUsuarios);

  const setArrayOrdenes = ordenStore((s) => s.setArrayOrdenes);
  const ordenes = ordenStore((s) => s.ordenes);

  const [view, setView] = useState<"Client" | "Orders">("Client");

  const getUsuarios = async () => {
    const data = await getAllUsuarios(token ?? null);
    if (data) setArrayUsuarios(data);
    console.log("Users: " + JSON.stringify(data, null, 2));
  };

  const getOrdenes = async () => {
    const data = await getAllOrdenes(token ?? null);
    if (data) setArrayOrdenes(data);
    console.log("Direcciones: " + JSON.stringify(data, null, 2));
  };


  useEffect(() => {
    if (!token) {
      console.warn("No hay token");
      navigate("/login");
    }
    getUsuarios();
  }, [token]);

   useEffect(() => {
    getOrdenes();
  }, []);

  return (
    <div className={styles.containerPrincipalClient}>
      <div>
        <Header />
      </div>
      <div className={styles.containerClientUi}>
        <ClientSideBar
          view={view}
          onChangeView={setView}
          name={usuario?.nombre ?? "NN"}
        />
        <div className={styles.containerElelements}>
          {view === "Client" ? (
            usuario ? (
              <ListCard
                key={usuario.id}
                variant="Client"
                id={usuario.id}
                name={usuario.nombre}
                email={usuario.email}
                rol={usuario.rol}
              />
            ) : (
              <h3>No se encontró el usuario</h3>
            )
          ) : view === "Orders" ? (
            Array.isArray(ordenes) && ordenes.length > 0 ? (
              ordenes.map((o) => (
                <ListCard
                  key={o.id}
                  variant="Orders"
                  id={o.id}
                  date={o.fecha}
                  detail={o.detalle}
                  payMethod={o.metodoPago}
                  Dstatus={o.estado}
                />
              ))
            ) : (
              <h3>No hay ordenes</h3>
            )
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  )
};
