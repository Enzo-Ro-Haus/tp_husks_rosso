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

  // Obtener productos filtrados
  const getProductos = async (filtrosAplicados = filtros) => {
    const data = await getProductosFiltrados({
      tipoId: filtrosAplicados.tipoId ? Number(filtrosAplicados.tipoId) : undefined,
      categoriaId: filtrosAplicados.categoriaId ? Number(filtrosAplicados.categoriaId) : undefined,
      nombre: filtrosAplicados.nombre || undefined,
      precioMin: filtrosAplicados.precioMin ? Number(filtrosAplicados.precioMin) : undefined,
      precioMax: filtrosAplicados.precioMax ? Number(filtrosAplicados.precioMax) : undefined,
      talleId: filtrosAplicados.talleId ? Number(filtrosAplicados.talleId) : undefined,
      sistemaTalle: sistemaTalle || undefined,
    });
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
          zIndex: 2000,
          borderRadius: '0 0 8px 8px',
          boxShadow: showFilters ? '0 4px 16px rgba(0,0,0,0.08)' : undefined,
          backgroundColor: '#f2f2f2',
        }}
      >
        <form onSubmit={handleFiltrar} className="container-fluid bg-light py-3 mb-0 w-100" style={{ borderRadius: '8px' }}>
          <div className="row g-3 align-items-center justify-content-center">
            <div className="col-12 col-md-3 col-lg-2">
              <select name="tipoId" value={filtros.tipoId} onChange={handleFiltroChange} className="form-select">
                <option value="">Tipo</option>
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
                <option value="">Sistema de talle</option>
                {Object.values(SistemaTalle).map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <select name="talleId" value={filtros.talleId} onChange={handleFiltroChange} className="form-select" disabled={!sistemaTalle}>
                <option value="">Talle</option>
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
                <button type="submit" className="btn btn-primary w-100">Filtrar</button>
                <button type="button" className="btn btn-success w-100" onClick={handleReset}>Reset</button>
                <button type="button" className="btn btn-danger w-100" onClick={() => setShowFilters(false)}>Cerrar</button>
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
            />
          ))
        ) : (
          <div className="w-100 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <h3 className="text-center">No hay productos</h3>
          </div>
        )}
      </div>
      <Footer /> 
    </div>
  );
};
