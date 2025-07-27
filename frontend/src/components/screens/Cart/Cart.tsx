import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
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
import { limpiarCarrito } from '../../../store/cartStore';
import { getEstadoOrdenPorPreferenceId } from '../../../http/ordenHTTPS';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MercadoLibreButton } from '../../ui/Buttons/MercadoLibreButton/MercadoLibreButton';
import { getMisUsuarioDirecciones } from "../../../http/direccionHTTP";


type ProductoMP = {
  id: string;
  title: string;
  description: string;
  pictureUrl: string;
  categoryId: string;
  quantity: number;
  currencyId: string;
  unitPrice: number;
};

export const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const direcciones = direccionStore((s) => s.direcciones).filter(d => d.activo);
  const direccionActiva = direccionStore((s) => s.direccionActiva);
  const setDireccionActiva = direccionStore((s) => s.setDireccionActiva);

  const [showModal, setShowModal] = useState(false);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>(MetodoPago.Tarjeta);
  const [loading, setLoading] = useState(false);
  const [estadoOrden, setEstadoOrden] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Depuración: mostrar detalles en consola

  useEffect(() => {
    setTotal(detalles);
  }, [detalles]);

  useEffect(() => {
    const fetchDirecciones = async () => {
      if (!usuario?.token) return;

      try {
        const direccionesBackend = await getMisUsuarioDirecciones(usuario.token);
        direccionStore.getState().setArrayDirecciones(direccionesBackend);
      } catch (error) {
        console.error("Error al cargar direcciones activas del usuario:", error);
      }
    };

    fetchDirecciones();
  }, [usuario]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (!status) return;
    if (status === 'approved') {
      // Crear la orden en el backend solo si el pago fue exitoso
      const preferenceId = params.get('preference_id');
      const paymentId = params.get('payment_id');
      // Solo crear la orden si hay detalles en el carrito y usuario logueado
      if (usuario && direccionActiva && detalles.length > 0) {
        createOrden(usuario.token || null, {
          usuario,
          usuarioDireccion: direccionActiva,
          fecha: new Date().toISOString(),
          precioTotal: total,
          metodoPago,
          estado: EstadoOrden.En_proceso, // O puedes poner 'Aprobada' si tienes ese estado
          detalles,
        }).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: 'Your payment was approved. The order was saved and the cart was cleared.',
            confirmButtonText: 'OK'
          });
          limpiarCarrito();
        }).catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error Saving Order',
            text: 'The payment was successful but the order could not be saved.',
            confirmButtonText: 'OK'
          });
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: 'Your payment was approved.',
          confirmButtonText: 'OK'
        });
        limpiarCarrito();
      }
    } else if (status === 'pending') {
      Swal.fire({
        icon: 'info',
        title: 'Payment Pending',
        text: 'Your payment is pending confirmation.',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Payment Rejected',
        text: 'There was a problem with your payment. Please try again.',
        confirmButtonText: 'OK'
      });
    }
  }, [location.search]);

  const handleComprar = async () => {
    if (!usuario || !direccionActiva || detalles.length === 0) return;
    // Validar stock
    for (const d of detalles) {
      if (d.cantidad > d.producto.cantidad) {
        alert(`Not enough stock available for product: ${d.producto.nombre}`);
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
      alert('Failed to create the order');
    } finally {
      setLoading(false);
    }
  };

  // Handler para Mercado Pago
  const handleMercadoPago = async () => {
    if (!detalles || detalles.length === 0 || !usuario || !direccionActiva) return;
    setLoading(true);
    try {
      // 1. Generar la preferencia de Mercado Pago
      const productos: ProductoMP[] = detalles.map((d): ProductoMP => ({
        id: String(d.producto.id),
        title: String(d.producto.nombre),
        description: String(d.producto.descripcion),
        pictureUrl: String(d.producto.imagenPublicId || ''),
        categoryId: typeof d.producto.categoria === 'string'
          ? d.producto.categoria
          : (d.producto.categoria?.nombre || ''),
        quantity: Number(d.cantidad),
        currencyId: 'ARS',
        unitPrice: Number(d.producto.precio),
      }));
      const response = await fetch('http://localhost:9000/api/mercado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(usuario.token ? { 'Authorization': `Bearer ${usuario.token}` } : {})
        },
        body: JSON.stringify(Array.isArray(productos) ? productos : [productos]),
      });
      if (!response.ok) throw new Error('Error al generar link de pago');
      const mpResponse = await response.json();

      // 2. Crear la orden en el backend con el preferenceId
      const nuevaOrden = await createOrden(usuario.token || null, {
        usuario,
        usuarioDireccion: direccionActiva,
        fecha: new Date().toISOString(),
        precioTotal: total,
        metodoPago,
        estado: EstadoOrden.En_proceso,
        detalles,
        preferenceId: mpResponse.preferenceId,
      });

      // 3. Redirigir al usuario
      window.location.href = mpResponse.url;
    } catch (error) {
      alert('No se pudo conectar con Mercado Pago');
      console.error(error);
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
        <div className={styles.muestraDeElementos}>
          <div className={styles.containerOrders}>
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
                <h3>This cart is empty, let's change that.</h3>
              </div>
            )}
          </div>
        </div>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minWidth: '220px', maxWidth: '260px', padding: '1rem 0.5rem', marginLeft: '1rem' }}>
          <CartSideBar total={total} onBuy={() => setShowModal(true)} buyDisabled={detalles.length === 0} />
        </div>
      </div>
      <Footer />
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label><b>Delivery Address:</b></label>
            {direcciones.length > 0 ? (
              <select className="form-select" value={direccionActiva?.id || ''} onChange={e => {
                const id = Number(e.target.value);
                const dir = direcciones.find(d => d.id === id);
                if (dir) setDireccionActiva(dir);
              }}>
                <option value="">Select an address</option>
                {direcciones.map(d => (
                  <option key={d.id} value={d.id}>{d.direccion.calle}, {d.direccion.localidad} ({d.direccion.cp})</option>
                ))}
              </select>
            ) : (
              <div className="alert alert-warning mt-2">You don’t have any saved addresses. Add one from your profile</div>
            )}
          </div>
          <div className="mt-3">
            <label><b>Payment Method:</b></label>
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
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '0.25rem', fontSize: '0.80rem', color: '#888' }}>
            To use Mercado Pago, you must select a delivery address and choose either "Bank Transfer" or "Card" as your payment method.
          </div>
          <MercadoLibreButton
            onClick={handleMercadoPago}
            disabled={
              !direccionActiva ||
              !(metodoPago === MetodoPago.Transferencia || metodoPago === MetodoPago.Tarjeta)
            }
            style={{ marginBottom: '0.5rem' }}
          />
          <Button variant="success" onClick={handleComprar} disabled={loading || !direccionActiva || direcciones.length === 0}>{loading ? 'Processing...' : 'Buy'}</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      {mensaje && <div className={estadoOrden === 'Entregado' ? 'success' : 'error'}>{mensaje}</div>}
    </div>
  );
};

export default Cart;
