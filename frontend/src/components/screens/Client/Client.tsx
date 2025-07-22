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
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { direccionStore } from '../../../store/direccionStore';
import * as addressAPI from '../../../http/direccionHTTP';
import Swal from 'sweetalert2';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { getMisUsuarioDirecciones } from '../../../http/direccionHTTP';
import { getMisOrdenes } from '../../../http/ordenHTTPS';

export const Client = () => {
  const navigate = useNavigate();

  const usuario = usuarioStore((s) => s.usuarioActivo);
  const token = usuarioStore((s) => s.usuarioActivo?.token);
  const setArrayUsuarios = usuarioStore((s) => s.setArrayUsuarios);

  const setArrayOrdenes = ordenStore((s) => s.setArrayOrdenes);
  const ordenes = ordenStore((s) => s.ordenes);

  // Use persistent view store instead of local state
  const { view, setView, resetView } = useClientView();
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
    const data = await getMisOrdenes(token ?? null);
    if (data) setArrayOrdenes(data);
    console.log("Direcciones: " + JSON.stringify(data, null, 2));
  };

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const usuarioActivo = usuarioStore((s) => s.usuarioActivo);
  const setArrayDirecciones = direccionStore((s) => s.setArrayDirecciones);
  const direcciones = direccionStore((s) => s.direcciones);

  const addressSchema = yup.object().shape({
    calle: yup.string().required('La calle es obligatoria'),
    localidad: yup.string().required('La localidad es obligatoria'),
    cp: yup
      .string()
      .required('El código postal es obligatorio')
      .matches(/^\d{4,10}$/, 'El código postal debe ser numérico y tener entre 4 y 10 dígitos'),
  });

  // Lógica para eliminar (soft delete) una dirección
  const handleDeleteDireccion = async (id: number) => {
    if (!token) return;
    try {
      await addressAPI.softDeleteUsuarioDireccion(token, id);
      Swal.fire({
        icon: 'success',
        title: 'Dirección eliminada',
        timer: 1500,
        showConfirmButton: false,
      });
      // Refresca el store de direcciones
      const direccionesActualizadas = await getMisUsuarioDirecciones(token);
      setArrayDirecciones(direccionesActualizadas);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'No se pudo eliminar la dirección',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };


  useEffect(() => {
    // Al entrar a /client, forzar la vista inicial a 'Client' (My user)
    setView("Client");
    getUsuario();
  }, [token]);

   useEffect(() => {
    getOrdenes();
  }, []);

  // Sincronizar direcciones al entrar a la vista Address
  useEffect(() => {
    if (view === 'Address' && token) {
      getMisUsuarioDirecciones(token).then(setArrayDirecciones);
    }
  }, [view, token, setArrayDirecciones]);

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
              onChangeView={setView as (view: "Orders" | "Client" | "Address") => void}
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
                direcciones && direcciones.filter((d: any) => d.activo !== false).length > 0 ? (
                  <div className="w-100" style={{ alignSelf: 'flex-start' }}>
                    <h3 className="mb-3" style={{ marginTop: 0 }}>Mis direcciones</h3>
                    <ul className="list-group mb-3">
                      {direcciones.filter((d: any) => d.activo !== false).map((d: any) => (
                        <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>{d.direccion.calle}, {d.direccion.localidad} ({d.direccion.cp})</span>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDireccion(d.id)}>Eliminar</button>
                        </li>
                      ))}
                    </ul>
                    <button className="btn btn-success" onClick={() => setShowAddressModal(true)}>Agregar dirección</button>
                  </div>
                ) : (
                  <div className="w-100" style={{ alignSelf: 'flex-start' }}>
                    <h3 className="mb-3" style={{ marginTop: 0 }}>Mis direcciones</h3>
                    <p className="text-muted">No tienes direcciones registradas</p>
                    <button className="btn btn-success" onClick={() => setShowAddressModal(true)}>Agregar dirección</button>
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
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar dirección</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ calle: '', localidad: '', cp: '' }}
          validationSchema={addressSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (!usuarioActivo) return;
            setSaving(true);
            try {
              await addressAPI.createUsuarioDireccion(usuarioActivo.token ?? null, {
                usuario: { id: usuarioActivo.id, nombre: usuarioActivo.nombre, email: usuarioActivo.email },
                direccion: values // values: { calle, localidad, cp }
              });
              // Refresca el store de direcciones para que la UI se actualice instantáneamente
              const direccionesActualizadas = await getMisUsuarioDirecciones(usuarioActivo.token ?? null);
              setArrayDirecciones(direccionesActualizadas);
              setShowAddressModal(false);
              resetForm();
            } catch (err) {
              alert('Error al crear dirección');
            } finally {
              setSaving(false);
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Modal.Body>
                <div className="mb-3">
                  <label className="form-label">Calle</label>
                  <Field type="text" name="calle" className="form-control" />
                  <ErrorMessage name="calle" component="div" className="text-danger small" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Localidad</label>
                  <Field type="text" name="localidad" className="form-control" />
                  <ErrorMessage name="localidad" component="div" className="text-danger small" />
                </div>
                <div className="mb-3">
                  <label className="form-label">CP</label>
                  <Field type="text" name="cp" className="form-control" />
                  <ErrorMessage name="cp" component="div" className="text-danger small" />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddressModal(false)} disabled={isSubmitting || saving}>Cancelar</Button>
                <Button variant="success" type="submit" disabled={isSubmitting || saving}>{(isSubmitting || saving) ? 'Guardando...' : 'Guardar'}</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
};
