import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllProductos } from "../../../http/productoHTTP";
import { getAllUsuarios } from "../../../http/usuarioHTTP";
import { getAllCategorias } from "../../../http/categoriaHTTP";
import { getAllTipos } from "../../../http/tipoHTTP";
import { getAllTalles } from "../../../http/talleHTTP";
import { getAllDireccions } from "../../../http/direccionHTTP";
import { getAllOrdenes } from "../../../http/ordenHTTPS";

import { productoStore } from "../../../store/prodcutoStore";
import { usuarioStore } from "../../../store/usuarioStore";
import { categoriaStore } from "../../../store/categoriaStore";
import { tipoStore } from "../../../store/tipoStore";
import { talleStore } from "../../../store/talleStore";
import { direccionStore } from "../../../store/direccionStore";
import { ordenStore } from "../../../store/ordenStore";

import { Header } from "../../ui/Header/Header";
import { Footer } from "../../ui/Footer/Footer";
import { AdminSideBar } from "../../ui/AdminSideBar/AdminSideBar";
import { ListCard } from "../../ui/Card/ListCard/ListCard";

import styles from "./Admin.module.css";

export const Admin = () => {
  const navigate = useNavigate();

  

  // stores
  const productos = productoStore((s) => s.productos);
  const setArrayProductos = productoStore((s) => s.setArrayProductos);

  const usuarios = usuarioStore((s) => s.usuarios);
  const usuario = usuarioStore((s) => s.usuarioActivo);
  const token = usuarioStore((s) => s.usuarioActivo?.token);
  const role = usuarioStore((s) => s.usuarioActivo?.rol);
  const setArrayUsuarios = usuarioStore((s) => s.setArrayUsuarios);
  

  const categorias = categoriaStore((s) => s.categorias);
  const setArrayCategorias = categoriaStore((s) => s.setArraycategorias);

  const tipos = tipoStore((s) => s.tipos);
  const setArrayTipos = tipoStore((s) => s.setArrayTipos);

  const talles = talleStore((s) => s.talles);
  const setArrayTalles = talleStore((s) => s.setArrayTalles);

  const direcciones = direccionStore((s) => s.direcciones);
  const setArrayDirecciones = direccionStore((s) => s.setArrayDirecciones);

  const ordenes = ordenStore((s) => s.ordenes);
  const setArrayOrdenes = ordenStore((s) => s.setArrayOrdenes);

  const [view, setView] = useState<
    | "Products"
    | "Users"
    | "Categories"
    | "Types"
    | "Sizes"
    | "Addresses"
    | "Orders"
  >("Products");

  // fetch functions
  const getProductos = async () => {
    const data = await getAllProductos(token ?? null);
    if (data) setArrayProductos(data);
  };
  const getUsuarios = async () => {
    if (!token) return;
    const data = await getAllUsuarios(token);
    if (data) setArrayUsuarios(data);
  };
  const getCategorias = async () => {
    if (!token) return;
    const data = await getAllCategorias(token);
    if (data) setArrayCategorias(data);
  };
  const getTipos = async () => {
    if (!token) return;
    const data = await getAllTipos(token);
    if (data) setArrayTipos(data);
  };
  const getTalles = async () => {
    if (!token) return;
    const data = await getAllTalles(token);
    if (data) setArrayTalles(data);
  };
  const getDirecciones = async () => {
    if (!token) return;
    const data = await getAllDireccions(token);
    if (data) setArrayDirecciones(data);
  };
  const getOrdenes = async () => {
    if (!token) return;
    const data = await getAllOrdenes(token);
    if (data) setArrayOrdenes(data);
  };

  // redirect if no token or not admin
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role === "CLIENTE") {
      navigate("/client");
      return;
    }
    getUsuarios();
  }, [token]);

  // load all data once token is present
  useEffect(() => {
    if (!token) return;
    getProductos();
    getCategorias();
    getTipos();
    getTalles();
    getDirecciones();
    getOrdenes();
  }, [token]);

  // render list by view
  const renderList = () => {
    switch (view) {
      case "Products":
        return productos.length > 0 ? (
          productos.map((el) => (
            <ListCard
              key={el.id}
              variant="Products"
              id={el.id || "NN"}
              name={el.nombre}
              description={el.descripcion}
              price={el.precio}
              quantity={el.cantidad}
              sizes={el.talles}
            />
          ))
        ) : (
          <h3>No hay productos</h3>
        );

      case "Users":
        return usuarios.length > 0 ? (
          usuarios.map((u) => (
            <ListCard
              key={u.id}
              variant="Users"
              id={u.id || "NN"}
              name={u.nombre}
              email={u.email}
              rol={u.rol}
              address={u.direcciones}
            />
          ))
        ) : (
          <h3>No hay usuarios</h3>
        );

      case "Categories":
        return categorias.length > 0 ? (
          categorias.map((c) => (
            <ListCard
              key={c.id}
              variant="Categories"
              id={c.id || "NN"}
              name={c.nombre}
              type={c.tipo}
            />
          ))
        ) : (
          <h3>No hay categorías</h3>
        );

      case "Types":
        return tipos.length > 0 ? (
          tipos.map((t) => (
            <ListCard
              key={t.id}
              variant="Types"
              id={t.id || "NN"}
              name={t.nombre}
              category={t.categorias}
            />
          ))
        ) : (
          <h3>No hay tipos</h3>
        );

      case "Sizes":
        return talles.length > 0 ? (
          talles.map((t) => (
            <ListCard
              key={t.id}
              variant="Sizes"
              id={t.id || "NN"}
              system={t.sistema}
              value={t.valor}
            />
          ))
        ) : (
          <h3>No hay talles</h3>
        );

      case "Addresses":
        return direcciones.length > 0 ? (
          direcciones.map((d) => (
            <ListCard
              key={d.id}
              variant="Addresses"
              id={d.id || "NN"}
              street={d.calle}
              locality={d.localidad}
              pc={d.cp}
            />
          ))
        ) : (
          <h3>No hay direcciones</h3>
        );

      case "Orders":
        return ordenes.length > 0 ? (
          ordenes.map((o) => (
            <ListCard
              key={o.id}
              variant="Orders"
              id={o.id || "NN"}
              date={o.fecha}
              detail={o.detalle}
              payMethod={o.metodoPago}
              Dstatus={o.estado}
            />
          ))
        ) : (
          <h3>No hay ordenes</h3>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.containerPrincipalAdmin}>
      <Header />
      <div className={styles.containerAdminUi}>
        <AdminSideBar
          view={view}
          onChangeView={setView}
          name={usuario?.nombre ?? "NN"}
        />
        <div className={styles.containerElelements}>{renderList()}</div>
      </div>
      <Footer />
    </div>
  );
};
