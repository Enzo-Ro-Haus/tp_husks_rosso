import styles from "./Client.module.css";
import { Header } from "../../ui/Header/Header";
import { Footer } from "../../ui/Footer/Footer";
import { ClientSideBar } from "../../ui/ClientSideBar/ClientSideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usuarioStore } from "../../../store/usuarioStore";
import { ordenStore } from "../../../store/ordenStore";
import { ListCard } from "../../ui/Card/ListCard/ListCard";
import { getAllUsuarios, getUsuarioActual } from "../../../http/usuarioHTTP";
import { getAllOrdenes } from "../../../http/ordenHTTPS";

export const Client = () => {
  const navigate = useNavigate();

  const usuario = usuarioStore((s) => s.usuarioActivo);
  const token = usuarioStore((s) => s.usuarioActivo?.token);
  const setArrayUsuarios = usuarioStore((s) => s.setArrayUsuarios);

  const setArrayOrdenes = ordenStore((s) => s.setArrayOrdenes);
  const ordenes = ordenStore((s) => s.ordenes);

  const [view, setView] = useState<"Client" | "Orders">("Client");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getUsuario = async () => {
    if (!token) return;
    try {
      const data = await getUsuarioActual(token);
      if (data) {
        setArrayUsuarios([data]);
        setErrorMsg(null);
        console.log("Usuario actual completo:", JSON.stringify(data, null, 2));
        console.log("imagenPerfilPublicId:", data.imagenPerfilPublicId);
      } else {
        setErrorMsg("No se pudo obtener la información del usuario.");
      }
      console.log("Usuario actual: " + JSON.stringify(data, null, 2));
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setErrorMsg("No tienes permisos para ver esta información.");
      } else {
        setErrorMsg("Ocurrió un error al obtener la información del usuario.");
      }
    }
  };

  const getOrdenes = async () => {
    const data = await getAllOrdenes(token ?? null);
    if (data) setArrayOrdenes(data);
    console.log("Direcciones: " + JSON.stringify(data, null, 2));
  };


  useEffect(() => {
    /*if (!token) {
      console.warn("No hay token");
      navigate("/login");
    }*/
    getUsuario();
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
          {errorMsg ? (
            <h3 style={{ color: 'red' }}>{errorMsg}</h3>
          ) : view === "Client" ? (
            usuario ? (
              <ListCard
                key={usuario.id}
                variant="Client"
                id={usuario.id || "NN"}
                name={usuario.nombre}
                email={usuario.email}
                rol={usuario.rol}
                imagenPerfilPublicId={usuario.imagenPerfilPublicId}
                onEdited={getUsuario}
                onDeleted={getUsuario}
                onRestored={getUsuario}
              />
            ) : (
              <h3>No se encontró el usuario</h3>
            )
          ) : view === "Orders" ? (
            Array.isArray(ordenes) && ordenes.length > 0 ? (
              ordenes.map((o) => {
                const total = o.precioTotal ?? (o.detalles?.reduce((sum, d) => sum + (d.producto?.precio || 0) * d.cantidad, 0) || 0);
                return (
                  <ListCard
                    key={String(o.id ?? 'NN')}
                    variant="Orders"
                    id={String(o.id ?? 'NN')}
                    date={o.fecha}
                    detail={o.detalles}
                    payMethod={o.metodoPago}
                    Dstatus={o.estado}
                    total={total}
                    usuario={typeof o.usuario === 'object' ? o.usuario : undefined}
                    usuarioDireccion={o.usuarioDireccion}
                    onEdited={getOrdenes}
                    onDeleted={getOrdenes}
                    onRestored={getOrdenes}
                  />
                );
              })
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
