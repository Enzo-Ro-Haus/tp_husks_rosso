import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { getPublicProductos, getProductosFiltrados } from "../../../http/productoHTTP";
import { productoStore } from "../../../store/prodcutoStore";
import { Footer } from "../../ui/Footer/Footer";
import { Header, Props as HeaderProps } from "../../ui/Header/Header";
import style from "../GenericStyle.module.css";
import style2 from "./Catalog.module.css";
import { ClotheCard } from "../../ui/Card/ClotheCard/ClotheCard";
import { getAllCategorias } from "../../../http/categoriaHTTP";
import { getAllTipos } from "../../../http/tipoHTTP";
import { ICategoria } from "../../../types/ICategoria";
import { ITipo } from "../../../types/ITipo";
import { getAllTalles } from "../../../http/talleHTTP";
import { ITalle } from "../../../types/ITalle";
import { useLocation } from "react-router-dom";
import { SistemaTalle } from "../../../types/enums/SistemaTalle";
import './FilterBarSlide.css'; // Importar el CSS de la animación
import { Modal, Button } from "react-bootstrap";
import CloudinaryImg from "../../ui/Image/CoudinaryImg";
import { cartStore } from '../../../store/cartStore';
import { Toast, ToastContainer, ButtonGroup, Button as BsButton } from 'react-bootstrap';
import { usuarioStore } from '../../../store/usuarioStore';

export const Catalog = () => {

 const productos = productoStore((state) => state.productos);
  const setArrayProductos = productoStore((state) => state.setArrayProductos);

  // Estado para filtros
  const filtrosIniciales = {
    tipoId: '',
    categoriaId: '',
    nombre: '',
    precioMin: '',
    precioMax: '',
    talleId: ''
  };
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [talles, setTalles] = useState<ITalle[]>([]);
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const [sistemaTalle, setSistemaTalle] = useState<string>("");
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [filterBarHeight, setFilterBarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(96);
  const [productoDetalle, setProductoDetalle] = useState<any | null>(null);
  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const agregarDetalle = cartStore((state) => state.agregarDetalle);
  const usuarioActivo = usuarioStore((state) => state.usuarioActivo);
  const [showImgModal, setShowImgModal] = useState(false);

  const handleShowDetalle = (producto: any) => {
    setProductoDetalle(producto);
    setShowModalDetalle(true);
  };
  const handleCloseDetalle = () => {
    setShowModalDetalle(false);
  };

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [showFilters]);

  useLayoutEffect(() => {
    if (showFilters && filterBarRef.current) {
      setFilterBarHeight(filterBarRef.current.offsetHeight);
    } else {
      setFilterBarHeight(0);
    }
  }, [showFilters, categorias, tipos, talles, sistemaTalle]);

  useEffect(() => {
    if (showModalDetalle) setCantidad(1);
  }, [showModalDetalle]);

  const handleAgregarAlCarrito = () => {
    if (!productoDetalle) return;
    agregarDetalle({
      cantidad,
      producto: productoDetalle,
      ordenDeCompra: {} as any
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      handleCloseDetalle();
    }, 1200);
  };

  // Cargar opciones de filtros al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    getAllCategorias(token).then(data => {
      console.log('categorias:', data);
      setCategorias(data);
    });
    getAllTipos(token).then(data => {
      console.log('tipos:', data);
      setTipos(data);
    });
    getAllTalles(token).then(setTalles);
    getProductos();
  }, []);

  // Filtrar talles por sistema seleccionado
  const tallesFiltrados = sistemaTalle
    ? talles.filter((t) => t.sistema === sistemaTalle)
    : talles;

  // Obtener productos filtrados o todos los públicos si no hay filtros
  const getProductos = async (filtrosAplicados = filtros) => {
    const hayFiltros = Object.values(filtrosAplicados).some(v => v && v !== '');
    let data;
    if (hayFiltros) {
      data = await getProductosFiltrados({
        tipoId: filtrosAplicados.tipoId ? Number(filtrosAplicados.tipoId) : undefined,
        categoriaId: filtrosAplicados.categoriaId ? Number(filtrosAplicados.categoriaId) : undefined,
        nombre: filtrosAplicados.nombre || undefined,
        precioMin: filtrosAplicados.precioMin ? Number(filtrosAplicados.precioMin) : undefined,
        precioMax: filtrosAplicados.precioMax ? Number(filtrosAplicados.precioMax) : undefined,
        talleId: filtrosAplicados.talleId ? Number(filtrosAplicados.talleId) : undefined,
        sistemaTalle: sistemaTalle || undefined,
      });
    } else {
      data = await getPublicProductos();
    }
    setArrayProductos(data);
  };

  // Manejar cambios en los filtros
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nuevosFiltros = { ...filtros, [name]: value };
    setFiltros(nuevosFiltros);
  };

  const handleSistemaTalleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSistemaTalle(e.target.value);
    setFiltros({ ...filtros, talleId: "" }); // Resetear valor al cambiar sistema
  };

  // Aplicar filtros
  const handleFiltrar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getProductos();
  };

  const handleReset = () => {
    setFiltros(filtrosIniciales);
    setSistemaTalle("");
    // Llama a getProductos después de limpiar filtros
    setTimeout(() => getProductos(filtrosIniciales), 0);
  };

  return (
   <div className={style.containerPrincipalPage}> 
      <Header ref={headerRef} showFilters={showFilters} setShowFilters={setShowFilters} />
      {/* Barra de filtros superpuesta, animación slide vertical */}
      <div
        ref={filterBarRef}
        className={`filterbar-slide w-100${showFilters ? ' filterbar-slide--open' : ''}`}
        id="filterBar"
        style={{
          position: 'fixed',
          top: headerHeight,
          left: 0,
          width: '100vw',
          zIndex: 10,
          borderRadius: '0 0 8px 8px',
          boxShadow: showFilters ? '0 4px 16px rgba(0,0,0,0.08)' : undefined,
          backgroundColor: '#f2f2f2',
        }}
      >
        <form onSubmit={handleFiltrar} className="container-fluid bg-light py-3 mb-0 w-100" style={{ borderRadius: '8px' }}>
          <div className="row g-3 align-items-center justify-content-center">
            <div className="col-12 col-md-3 col-lg-2">
              <select name="tipoId" value={filtros.tipoId} onChange={handleFiltroChange} className="form-select">
                <option value="">Type</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3 col-lg-2">
              <select name="categoriaId" value={filtros.categoriaId} onChange={handleFiltroChange} className="form-select">
                <option value="">Categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <select name="sistemaTalle" value={sistemaTalle} onChange={handleSistemaTalleChange} className="form-select">
                <option value="">Size system</option>
                {Object.values(SistemaTalle).map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <select name="talleId" value={filtros.talleId} onChange={handleFiltroChange} className="form-select" disabled={!sistemaTalle}>
                <option value="">Size</option>
                {tallesFiltrados.map((talle) => (
                  <option key={talle.id} value={talle.id}>{talle.valor}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <input name="nombre" value={filtros.nombre} onChange={handleFiltroChange} placeholder="Nombre" className="form-control" />
            </div>
            {/* Agrupar precios en una fila interna */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="row g-2">
                <div className="col-6">
                  <div className="input-group">
                    <span className="input-group-text">Min</span>
                    <input name="precioMin" value={filtros.precioMin} onChange={handleFiltroChange} placeholder="0" type="number" min="0" className="form-control" />
                  </div>
                </div>
                <div className="col-6">
                  <div className="input-group">
                    <span className="input-group-text">Max</span>
                    <input name="precioMax" value={filtros.precioMax} onChange={handleFiltroChange} placeholder="99999" type="number" min="0" className="form-control" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-1">
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100">Filter</button>
                <button type="button" className="btn btn-success w-100" onClick={handleReset}>Reset</button>
                <button type="button" className="btn btn-danger w-100" onClick={() => setShowFilters(false)}>Close</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        className={style2.containerProducts}
      >
        {productos.length > 0 ? (
          productos.map((el) => (
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
          <div className="w-100 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <h3 className="text-center">No prduct avaliable</h3>
          </div>
        )}
      </div>
      {/* Modal global de detalles de producto */}
      <Modal show={showModalDetalle} onHide={handleCloseDetalle} centered onExited={() => setProductoDetalle(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{productoDetalle?.nombre} details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center text-center">
            {/* Nombre */}
            <h2 className="fw-bold mb-2" style={{fontSize: '2rem'}}>{productoDetalle?.nombre}</h2>
            {/* Imagen */}
            {productoDetalle?.imagenPublicId && (
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
            {/* Precio */}
            <div className="mb-2">
              <span className="fw-bold" style={{fontSize: '1.7rem', color: '#231f20'}}>${productoDetalle?.precio}</span>
            </div>
            {/* Descripción */}
            <div className="mb-3 text-secondary" style={{maxWidth: 350}}>
              {productoDetalle?.descripcion}
            </div>
            {/* Etiquetas informativas en fila */}
            <div className="mb-2 d-flex flex-wrap justify-content-center gap-2">
              {productoDetalle?.categoria && <span className="badge bg-dark text-white">Categories: {productoDetalle.categoria.nombre}</span>}
              {productoDetalle?.tipo && <span className="badge bg-dark text-white">Type: {productoDetalle.tipo.nombre}</span>}
              <span className="badge bg-dark text-white">
                {productoDetalle?.cantidad > 0 ? `Stock: ${productoDetalle.cantidad}` : 'No stock'}
              </span>
              {productoDetalle?.tallesDisponibles && productoDetalle.tallesDisponibles.length > 0 && (
                <span className="badge bg-dark text-white">
                  Sizes: {productoDetalle.tallesDisponibles.map((t: any, idx: number) => `${t.sistema} ${t.valor}`).join(", ")}
                </span>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between align-items-center gap-2 gap-md-4 w-100">
            {usuarioActivo && usuarioActivo.rol !== 'ADMIN' && (
              <>
                <ButtonGroup>
                  <BsButton
                    variant={cantidad <= 1 || !productoDetalle ? "outline-dark" : "dark"}
                    size="sm"
                    onClick={() => setCantidad(c => Math.max(1, c - 1))}
                    disabled={cantidad <= 1 || !productoDetalle}
                    style={{ minWidth: 36, fontWeight: 700, color: (cantidad <= 1 || !productoDetalle) ? '#888' : 'white', background: (cantidad <= 1 || !productoDetalle) ? '#bdbdbd' : undefined, borderColor: (cantidad <= 1 || !productoDetalle) ? '#111' : undefined }}
                  >
                    -
                  </BsButton>
                  <BsButton variant="dark" size="sm" disabled style={{ width: 40, fontWeight: 700, color: 'white', background: '#111', borderColor: '#111' }}>{cantidad}</BsButton>
                  <BsButton
                    variant={(!productoDetalle || cantidad >= (productoDetalle?.cantidad ?? 1)) ? "outline-dark" : "dark"}
                    size="sm"
                    onClick={() => setCantidad(c => productoDetalle ? Math.min(productoDetalle.cantidad, c + 1) : c)}
                    disabled={!productoDetalle || cantidad >= (productoDetalle?.cantidad ?? 1)}
                    style={{ minWidth: 36, fontWeight: 700, color: (!productoDetalle || cantidad >= (productoDetalle?.cantidad ?? 1)) ? '#888' : 'white', background: (!productoDetalle || cantidad >= (productoDetalle?.cantidad ?? 1)) ? '#bdbdbd' : undefined, borderColor: (!productoDetalle || cantidad >= (productoDetalle?.cantidad ?? 1)) ? '#111' : undefined }}
                  >
                    +
                  </BsButton>
                </ButtonGroup>
                <style>{`
                  .btn-dark, .btn-outline-dark {
                    color: #fff !important;
                  }
                  .btn-outline-dark:active, .btn-outline-dark:focus, .btn-outline-dark:hover {
                    background: #222 !important;
                    border-color: #222 !important;
                    color: #fff !important;
                  }
                `}</style>
                <Button variant="primary" className="flex-grow-1 mx-2" style={{minWidth:120}} onClick={handleAgregarAlCarrito} disabled={!productoDetalle || productoDetalle?.cantidad === 0}>Agregar al carrito</Button>
              </>
            )}
            <Button variant="danger" onClick={handleCloseDetalle}>Cerrar</Button>
          </div>
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
      <ToastContainer position="top-center" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={1200} autohide bg="success">
          <Toast.Body className="text-white">¡Succefully added!</Toast.Body>
        </Toast>
      </ToastContainer>
      <Footer /> 
    </div>
  );
};
