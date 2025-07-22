import { useNavigate } from "react-router";
import { useEffect } from "react";
import { CartSideBar } from "../../ui/CartSideBar/CartSideBar";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import styles from "./Cart.module.css";
import { usuarioStore } from "../../../store/usuarioStore";
import { cartStore } from "../../../store/cartStore";
import { ListCard } from "../../ui/Card/ListCard/ListCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { direccionStore } from '../../../store/direccionStore';
import { MetodoPago } from '../../../types/enums/MetodoPago';
import { createOrden } from '../../../http/ordenHTTPS';
import { EstadoOrden } from '../../../types/enums/EstadoOrden';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

export const Cart = () => {
  const navigate = useNavigate();
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  const orden = cartStore((s) => s.orden);
  const detalles = cartStore((s) => s.detalles);
  const setOrden = cartStore((s) => s.setOrden);
  const agregarDetalles = cartStore((s) => s.agregarDetalle);
  const setTotal = cartStore((s) => s.setTotal);
  const total = cartStore((s) => s.total);
  const detalleActivo = cartStore((s) => s.detalleActivo);
  const editarDetalleActivo = cartStore((s) => s.editarDetalle);
  const eliminarDetalle = cartStore((s) => s.eliminarDetalle);
  const editarDetalle = cartStore((s) => s.editarDetalle);

  const usuario = usuarioStore((s) => s.usuarioActivo);
  const direcciones = usuario?.direcciones || [];
  const direccionActiva = direccionStore((s) => s.direccionActiva);
  const setDireccionActiva = direccionStore((s) => s.setDireccionActiva);

  const [showModal, setShowModal] = useState(false);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>(MetodoPago.Tarjeta);
  const [loading, setLoading] = useState(false);

  // Depuración: mostrar detalles en consola
  console.log("Detalles del carrito:", detalles);

  useEffect(() => {
    setTotal(detalles);
  }, [detalles]);

  const limpiarCarrito = () => {
    cartStore.setState({ detalles: [], total: 0 });
  };

  const handleComprar = async () => {
    if (!usuario || !direccionActiva || detalles.length === 0) return;
    // Validar stock
    for (const d of detalles) {
      if (d.cantidad > d.producto.cantidad) {
        alert(`No hay suficiente stock para ${d.producto.nombre}`);
        return;
      }
    }
    setLoading(true);
    try {
      await createOrden(usuario.token || null, {
        usuario,
        usuarioDireccion: direccionActiva,
        fecha: new Date().toISOString(),
        precioTotal: total,
        metodoPago,
        estado: EstadoOrden.En_proceso,
        detalles,
      });
      limpiarCarrito();
      setShowModal(false);
    } catch (e) {
      alert('Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  // Si detalles es undefined o null, mostrar error visible
  if (typeof detalles === "undefined" || detalles === null) {
    return (
      <div className={styles.containerPrincipalCart}>
        <h2 style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
          Error: No se pudo cargar el carrito. (detalles es null o undefined)
        </h2>
      </div>
    );
  }

  return (
    <div className={styles.containerPrincipalCart}>
      <Header />
      <div className={styles.containerBody}>
        <div className={styles.containerOrders} style={{ flexDirection: 'column', width: '100%' }}>
          {detalles && detalles.length > 0 ? (
            detalles.map((d) => (
              <div key={d.producto.id} style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <ListCard
                  variant="CartProduct"
                  id={d.producto.id || "NN"}
                  name={d.producto.nombre}
                  description={d.producto.descripcion}
                  price={d.producto.precio}
                  quantity={d.cantidad}
                  category={d.producto.categoria}
                  type={d.producto.tipo}
                  sizes={d.producto.tallesDisponibles}
                  imagenPublicId={d.producto.imagenPublicId}
                  onDeleted={() => { eliminarDetalle(d.producto.id as number); }}
                />
              </div>
            ))
          ) : (
            <div style={{ width: '100%' }}>
              <h3>Este carrito está vacío, cambiemos eso</h3>
            </div>
          )}
        </div>
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minWidth: '220px', maxWidth: '260px', padding: '1rem 0.5rem', marginLeft: '1rem'}}>
          <CartSideBar total={total} onBuy={() => setShowModal(true)} buyDisabled={detalles.length === 0} />
        </div>
      </div>
      <Footer />
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label><b>Dirección de entrega:</b></label>
            {direcciones.length > 0 ? (
              <select className="form-select" value={direccionActiva?.id || ''} onChange={e => {
                const id = Number(e.target.value);
                const dir = direcciones.find(d => d.id === id);
                if (dir) setDireccionActiva(dir);
              }}>
                <option value="">Selecciona una dirección</option>
                {direcciones.map(d => (
                  <option key={d.id} value={d.id}>{d.direccion.calle}, {d.direccion.localidad} ({d.direccion.cp})</option>
                ))}
              </select>
            ) : (
              <div className="alert alert-warning mt-2">No tienes direcciones registradas. Agrega una desde tu perfil.</div>
            )}
          </div>
          <div className="mt-3">
            <label><b>Método de pago:</b></label>
            <select className="form-select" value={metodoPago} onChange={e => setMetodoPago(e.target.value as MetodoPago)}>
              {Object.values(MetodoPago).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <b>Total:</b> ${total}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>Cancelar</Button>
          <Button variant="success" onClick={handleComprar} disabled={loading || !direccionActiva || direcciones.length === 0}>{loading ? 'Procesando...' : 'Comprar'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
