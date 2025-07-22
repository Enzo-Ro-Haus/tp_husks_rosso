import { ClotheCard } from "../Card/ClotheCard/ClotheCard";
import styles from "./Showcase.module.css";
import { productoStore } from "../../../store/prodcutoStore";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import * as productoAPI from "../../../http/productoHTTP";
import { Modal, Button as BsButton } from "react-bootstrap";
import CloudinaryImg from "../Image/CoudinaryImg";

//Puede que falte el useEffect

export const Showcase = () => {
  const productos = productoStore((s) => s.productos);
  const setArrayProductos = productoStore((s) => s.setArrayProductos);
  const [productoDetalle, setProductoDetalle] = useState<any | null>(null);
  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);

  useEffect(() => {
    // Cargar productos públicos al montar
    productoAPI.getPublicProductos().then((prods) => {
      setArrayProductos(prods);
    });
  }, [setArrayProductos]);

  const handleShowDetalle = (producto: any) => {
    setProductoDetalle(producto);
    setShowModalDetalle(true);
  };
  const handleCloseDetalle = () => {
    setShowModalDetalle(false);
    setProductoDetalle(null);
  };
  
  return ( 
    <div className={styles.containerPincipalShowcase}>
      <div className={styles.containerTitleButton}>
        <h2 className={styles.containerTitle}>CATALOG</h2>
        <div className={styles.buttonContainer}>
          <Button variant="outline-dark">
            <Link to="/catalog"  className={styles.buttonViewAll}>
              View All
            </Link>
          </Button>
        </div>
      </div>
      <div className={styles.containerClotheCards}>
        {productos.length > 0 ? (
          productos
            .slice(0, 4)
            .map((el) => (
              <ClotheCard
                key={el.id}
                name={el.nombre}
                description={el.descripcion}
                price={el.precio}
                imagenPublicId={el.imagenPublicId}
                cantidad={el.cantidad}
                onDetailsClick={() => handleShowDetalle(el)}
              />
            ))
        ) : (
          <div>
            <h3>No hay productos</h3>
          </div>
        )}
      </div>
      {/* Modal de detalles de producto */}
      <Modal show={showModalDetalle} onHide={handleCloseDetalle} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de {productoDetalle?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoDetalle && (
            <div className="d-flex flex-column align-items-center text-center w-100">
              <h2 className="fw-bold mb-2" style={{fontSize: '2rem'}}>{productoDetalle.nombre}</h2>
              {productoDetalle.imagenPublicId && (
                <div className="mb-3">
                  <span style={{cursor:'zoom-in', display:'inline-block'}} onClick={() => setShowImgModal(true)}>
                    <CloudinaryImg
                      publicId={productoDetalle.imagenPublicId}
                      width={120}
                      height={120}
                      alt={productoDetalle.nombre}
                      className="rounded shadow"
                      style={{ width: 120, height: 120, objectFit: 'cover', display: 'inline-block', border: '2px solid #eee' }}
                    />
                  </span>
                </div>
              )}
              <div className="mb-2">
                <span className="fw-bold" style={{fontSize: '1.7rem', color: '#231f20'}}>${productoDetalle.precio}</span>
              </div>
              <div className="mb-3 text-secondary" style={{maxWidth: 350}}>
                {productoDetalle.descripcion}
              </div>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {productoDetalle?.categoria && <span className="badge bg-dark text-white">Categoría: {productoDetalle.categoria.nombre}</span>}
                {productoDetalle?.tipo && <span className="badge bg-dark text-white">Tipo: {productoDetalle.tipo.nombre}</span>}
                <span className="badge bg-dark text-white">
                  {productoDetalle?.cantidad > 0 ? `Stock: ${productoDetalle.cantidad}` : 'Sin stock'}
                </span>
                {productoDetalle?.tallesDisponibles && productoDetalle.tallesDisponibles.length > 0 && (
                  <span className="badge bg-dark text-white">
                    Talles: {productoDetalle.tallesDisponibles.map((t: any, idx: number) => `${t.sistema} ${t.valor}`).join(", ")}
                  </span>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <BsButton variant="danger" onClick={handleCloseDetalle}>Cerrar</BsButton>
        </Modal.Footer>
      </Modal>
      {/* Modal para imagen ampliada */}
      <Modal show={showImgModal} onHide={() => setShowImgModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-dark border-0" style={{color: 'white'}}>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            style={{ filter: 'invert(60%) grayscale(100%)', position: 'absolute', right: 16, top: 16, zIndex: 10 }}
            onClick={() => setShowImgModal(false)}
          />
        </Modal.Header>
        <Modal.Body className="text-center bg-dark">
          {productoDetalle?.imagenPublicId && (
            <CloudinaryImg
              publicId={productoDetalle.imagenPublicId}
              width={500}
              height={400}
              alt={productoDetalle.nombre}
              className="rounded shadow"
              style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain', background: '#222' }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};
