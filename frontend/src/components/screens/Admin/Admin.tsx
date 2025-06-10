import { useEffect, useState } from "react";
import { getAllProductos } from "../../../http/productoHTTP";
import { getAllUsuarios } from "../../../http/usuarioHTTP";
import { productoStore } from "../../../store/prodcutoStore";
import { usuarioStore } from "../../../store/usuarioStore";
import { AdminSideBar } from "../../ui/AdminSideBar/AdminSideBar";
import { Header } from "../../ui/Header/Header";
import { Footer } from "../../ui/Footer/Footer";
import { ListCard } from "../../ui/Card/ListCard/ListCard";
import styles from "./Admin.module.css";
import { categoriaStore } from "../../../store/categoriaStore";
import { getAllCategorias } from "../../../http/categoriaHTTP";
import { tipoStore } from "../../../store/tipoStore";
import { getAllTipos } from "../../../http/tipoHTTP";
import { talleStore } from "../../../store/talleStore";
import { getAllTalles } from "../../../http/talleHTTP";
import { direccionStore } from "../../../store/direccionStore";
import { getAllDireccions } from "../../../http/direccionHTTP";
import { ordenStore } from "../../../store/ordenStore";
import { getAllOrdenes } from "../../../http/ordenHTTPS";
import { useNavigate } from "react-router";

export const Admin = () => {
 const navigate = useNavigate();

  const productos = productoStore((s) => s.productos);
  const setArrayProductos = productoStore((s) => s.setArrayProductos);

  const usuarios = usuarioStore((s) => s.usuarios);
  const usuario = usuarioStore((s) => s.usuarioActivo);
  const token = usuarioStore((s) => s.usuarioActivo?.token);
  const setArrayUsuarios = usuarioStore((s) => s.setArrayUsuarios);

  const setArrayCategorias = categoriaStore((s) => s.setArraycategorias);
  const categorias = categoriaStore((s) => s.categorias);

  const setArrayTipos = tipoStore((s) => s.setArrayTipos);
  const tipos = tipoStore((s) => s.tipos);

  const setArrayTalles = talleStore((s) => s.setArrayTalles);
  const talles = talleStore((s) => s.talles);

  const setArrayDirecciones = direccionStore((s) => s.setArrayDirecciones);
  const direcciones = direccionStore((s) => s.direcciones);

  const setArrayOrdenes = ordenStore((s) => s.setArrayOrdenes);
  const ordenes = ordenStore((s) => s.ordenes);

  const [view, setView] = useState<
    | "Products"
    | "Users"
    | "Categories"
    | "Types"
    | "Sizes"
    | "Addresses"
    | "Orders"
  >("Products");

  const getProductos = async () => {
    const data = await getAllProductos();
    if (data) setArrayProductos(data);
    console.log("Products " +  JSON.stringify(data, null, 2));
  };

  const getUsuarios = async () => {
    const data = await getAllUsuarios(token ?? null);
    if (data) setArrayUsuarios(data);
    console.log("Users: " +  JSON.stringify(data, null, 2));
  };

  const getCategorias = async () => {
    const data = await getAllCategorias(token ?? null);
    if (data) setArrayCategorias(data);
    console.log("Categorias: " + JSON.stringify(data, null, 2));
  };

  const getTipos = async () => {
    const data = await getAllTipos(token ?? null);
    if (data) setArrayTipos(data);
    console.log("Tipos: " +  JSON.stringify(data, null, 2));
  };

  const getTalles = async () => {
    const data = await getAllTalles(token ?? null);
    if (data) setArrayTalles(data);
    console.log("Talles: " +  JSON.stringify(data, null, 2));
  };

  const getDirecciones = async () => {
    const data = await getAllDireccions(token ?? null);
    if (data) setArrayDirecciones(data);
    console.log("Direcciones: " +  JSON.stringify(data, null, 2));
  };

  const getOrdenes = async () => {
    const data = await getAllOrdenes(token ?? null);
    if (data) setArrayOrdenes(data);
    console.log("Direcciones: " +  JSON.stringify(data, null, 2));
  };

  useEffect(() => {
    getProductos();
    getCategorias();
    getTipos();
    getTalles();
    getDirecciones();
    getOrdenes();
  }, []);

  useEffect(() => {
    if (!token) {
      console.warn("No hay token");
      navigate("/login");
    }
    getUsuarios();
  }, [token]);

  return (
    <div className={styles.containerPrincipalAdmin}>
      <Header />

      <div className={styles.containerAdminUi}>
        <AdminSideBar view={view} onChangeView={setView} />
        <div className={styles.containerElelements}>
          {view === "Products" ? (
            productos.length > 0 ? (
              productos.map((el) => (
                <ListCard
                  key={el.id}
                  variant="Products"
                  id={el.id}
                  name={el.nombre}
                  description={el.descripcion}
                  price={el.precio}
                  quantity={el.cantidad}
                  sizes={el.talles}
                />
              ))
            ) : (
              <h3>No hay productos</h3>
            )
          ) : view === "Users" ? (
            Array.isArray(usuarios) && usuarios.length > 0 ? (
              usuarios.map((u) => (
                <ListCard
                  key={u.id}
                  variant="Users"
                  id={u.id}
                  name={u.nombre}
                  email={u.email}
                  rol={u.rol}
                />
              ))
            ) : (
              <h3>No hay usuarios</h3>
            )
          ) : view === "Categories" ? (
            Array.isArray(categorias) && categorias.length > 0 ? (
              categorias.map((c) => (
                <ListCard
                  key={c.id}
                  variant="Categories"
                  id={c.id}
                  name={c.nombre}
                  type={c.tipo}
                />
              ))
            ) : (
              <h3>No hay categorías</h3>
            )
          ) : view === "Types" ? (
            Array.isArray(tipos) && tipos.length > 0 ? (
              tipos.map((t) => (
                <ListCard
                  key={t.id}
                  variant="Types"
                  id={t.id}
                  name={t.nombre}
                />
              ))
            ) : (
              <h3>No hay tipos</h3>
            )
          ) : view === "Sizes" ? (
            Array.isArray(talles) && talles.length > 0 ? (
              talles.map((t) => (
                <ListCard
                  key={t.id}
                  variant="Sizes"
                  id={t.id}
                  system={t.sistema}
                  value={t.valor}
                />
              ))
            ) : (
              <h3>No hay talles</h3>
            )
          ) : view === "Addresses" ? (
            Array.isArray(direcciones) && direcciones.length > 0 ? (
              direcciones.map((d) => (
                <ListCard
                  key={d.id}
                  variant="Addresses"
                  id={d.id}
                  street={d.calle}
                  locality={d.localidad}
                  pc={d.cp}
                />
              ))
            ) : (
              <h3>No hay direcciones</h3>
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
  );
};
