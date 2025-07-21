import styles from "./Client.module.css";
import { Header } from "../../ui/Header/Header";
import { Footer } from "../../ui/Footer/Footer";
import { ClientSideBar } from "../../ui/ClientSideBar/ClientSideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usuarioStore } from "../../../store/usuarioStore";
import { ordenStore } from "../../../store/ordenStore";
import { useClientView } from "../../../hooks/useViewState";
import { ListCard } from "../../ui/Card/ListCard/ListCard";
import UserProfileCard from "../../ui/UserProfileCard/UserProfileCard";
import { getAllUsuarios, getUsuarioActual } from "../../../http/usuarioHTTP";
import { getAllOrdenes } from "../../../http/ordenHTTPS";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export const Client = () => {
  const navigate = useNavigate();

  const usuario = usuarioStore((s) => s.usuarioActivo);
  const token = usuarioStore((s) => s.usuarioActivo?.token);
  const setArrayUsuarios = usuarioStore((s) => s.setArrayUsuarios);

  const setArrayOrdenes = ordenStore((s) => s.setArrayOrdenes);
  const ordenes = ordenStore((s) => s.ordenes);

  // Use persistent view store instead of local state
  const { view, setView } = useClientView();
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
      <Container fluid>
        <Row>
          <Header />
        </Row>
        <Row className="h-100" style={{height: '100%'}}>
          <div className={styles.containerClientUi} style={{height: '100%'}}>
            <ClientSideBar
              view={view}
              onChangeView={setView}
              name={usuario?.nombre ?? "NN"}
            />
            <div className={styles.containerElelements} style={{height: '100%'}}>
              {errorMsg ? (
                <h3 style={{ color: 'red' }}>{errorMsg}</h3>
              ) : view === "Client" ? (
                usuario ? (
                  <UserProfileCard
                    usuario={usuario}
                    onEdited={getUsuario}
                    onDeleted={getUsuario}
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
              ) : view === "Address" ? (
                usuario && usuario.direcciones && usuario.direcciones.filter((d: any) => d.activo !== false).length > 0 ? (
                  <div className="w-100" style={{ alignSelf: 'flex-start' }}>
                    <h3 className="mb-3" style={{ marginTop: 0 }}>Mis direcciones</h3>
                    <ul className="list-group mb-3">
                      {usuario.direcciones.filter((d: any) => d.activo !== false).map((d: any) => (
                        <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>{d.direccion.calle}, {d.direccion.localidad} ({d.direccion.cp})</span>
                          <button className="btn btn-danger btn-sm" onClick={() => {/* lógica de soft delete aquí */}}>Eliminar</button>
                        </li>
                      ))}
                    </ul>
                    <button className="btn btn-success" onClick={() => {/* lógica para agregar dirección aquí */}}>Agregar dirección</button>
                  </div>
                ) : (
                  <div className="w-100" style={{ alignSelf: 'flex-start' }}>
                    <h3 className="mb-3" style={{ marginTop: 0 }}>Mis direcciones</h3>
                    <p className="text-muted">No tienes direcciones registradas</p>
                    <button className="btn btn-success" onClick={() => {/* lógica para agregar dirección aquí */}}>Agregar dirección</button>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  )
};
