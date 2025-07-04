import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAllProductos, testBackendConnection, testProductoData } from "../../../http/productoHTTP";
import { getAllUsuarios } from "../../../http/usuarioHTTP";
import { getAllCategorias } from "../../../http/categoriaHTTP";
import { getAllTipos } from "../../../http/tipoHTTP";
import { getAllTalles } from "../../../http/talleHTTP";
import { getAllDirecciones, getAllUsuarioDirecciones } from "../../../http/direccionHTTP";
import { getAllOrdenes } from "../../../http/ordenHTTPS";

import { productoStore } from "../../../store/prodcutoStore";                                 
import { usuarioStore } from "../../../store/usuarioStore";                                                                     
import { categoriaStore } from "../../../store/categoriaStore";                                                                                                                                                               
import { tipoStore } from "../../../store/tipoStore";                                                         
import { talleStore } from "../../../store/talleStore";                         
import { direccionFisicaStore } from "../../../store/direccionStore";
import { ordenStore } from "../../../store/ordenStore";

import { Header } from "../../ui/Header/Header";
import { Footer } from "../../ui/Footer/Footer";
import { AdminSideBar } from "../../ui/AdminSideBar/AdminSideBar";
import { ListCard } from "../../ui/Card/ListCard/ListCard";

import styles from "./Admin.module.css";

export const Admin = () => {
  const navigate = useNavigate();
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  // Test backend connection once on component mount
  useEffect(() => {
    const testConnection = async () => {
      const connected = await testBackendConnection();
      console.log("Backend connection test result:", connected);
      
      if (connected) {
        const data = await testProductoData();
        console.log("Producto data test result:", data);
      }
    };
    testConnection();
  }, []); // Empty dependency array to run only once

  // stores
  const productos = productoStore((s) => s.productos);
  const setArrayProductos = productoStore((s) => s.setArrayProductos);

  const usuarios = usuarioStore((s) => s.usuarios);
  const usuario = usuarioStore((s) => s.usuarioActivo);
  const role = usuarioStore((s) => s.usuarioActivo?.rol);
  const setArrayUsuarios = usuarioStore((s) => s.setArrayUsuarios);

  const categorias = categoriaStore((s) => s.categorias);
  const setArrayCategorias = categoriaStore((s) => s.setArraycategorias);

  const tipos = tipoStore((s) => s.tipos);
  const setArrayTipos = tipoStore((s) => s.setArrayTipos);

  const talles = talleStore((s) => s.talles);
  const setArrayTalles = talleStore((s) => s.setArrayTalles);

  const direcciones = direccionFisicaStore((s) => s.direccionesFisicas);
  const setArrayDirecciones = direccionFisicaStore((s) => s.setArrayDireccionesFisicas);

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

  const getProductos = useCallback(async () => {
    console.log("=== getProductos llamado ===");
    console.log("token en getProductos:", token);
    if (!token) {
      console.log("getProductos - no hay token, saliendo");
      return;
    }
    const data = await getAllProductos(token ?? null);
    console.log("getProductos - data recibida:", data);
    if (data) {
      setArrayProductos(data);
    }
  }, [token, setArrayProductos]);

  const getUsuarios = useCallback(async () => {
    if (!token) return;
    console.log("=== getUsuarios llamado ===");
    const data = await getAllUsuarios(token);
    console.log("getUsuarios - data recibida:", data);
    if (data) setArrayUsuarios(data);
  }, [token, setArrayUsuarios]);

  const getCategorias = useCallback(async () => {
    if (!token) {
      console.log("getCategorias - no hay token, saliendo");
      return;
    }
    console.log("=== getCategorias llamado ===");
    const data = await getAllCategorias(token);
    console.log("getCategorias - data recibida:", data);
    if (data) setArrayCategorias(data);
  }, [token, setArrayCategorias]);

  const getTipos = useCallback(async () => {
    if (!token) {
      console.log("getTipos - no hay token, saliendo");
      return;
    }
    console.log("=== getTipos llamado ===");
    const data = await getAllTipos(token);
    console.log("getTipos - data recibida:", data);
    if (data) setArrayTipos(data);
  }, [token, setArrayTipos]);

  const getTalles = useCallback(async () => {
    if (!token) {
      console.log("getTalles - no hay token, saliendo");
      return;
    }
    console.log("=== getTalles llamado ===");
    const data = await getAllTalles(token);
    console.log("getTalles - data recibida:", data);
    if (data) setArrayTalles(data);
  }, [token, setArrayTalles]);

  const getDirecciones = useCallback(async () => {
    if (!token) {
      console.log("getDirecciones - no hay token, saliendo");
      return;
    }
    console.log("=== getDirecciones llamado ===");
    const data = await getAllDirecciones(token);
    console.log("getDirecciones - data recibida:", data);
    if (data) setArrayDirecciones(data);
  }, [token, setArrayDirecciones]);

  const getUsuarioDirecciones = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getAllUsuarioDirecciones(token);
      console.log("Usuario-Direcciones obtenidas:", data);
      return data;
    } catch (error) {
      console.log("No hay asignaciones usuario-dirección o error:", error);
      return [];
    }
  }, [token]);

  const getOrdenes = useCallback(async () => {
    if (!token) {
      console.log("getOrdenes - no hay token, saliendo");
      return;
    }
    console.log("=== getOrdenes llamado ===");
    const data = await getAllOrdenes(token);
    console.log("getOrdenes - data recibida:", data);
    if (data) setArrayOrdenes(data);
  }, [token, setArrayOrdenes]);

  
  useEffect(() => {
    // redirect if no token or not admin
    /*if (!token) {
      navigate("/login");
      return;
    }
    if (role === "CLIENTE") {
      navigate("/client");
      return;
    }*/
    // Solo cargar datos si tenemos token y somos admin
    if (token && role === "ADMIN") {
      getUsuarios();
      getProductos();
      getCategorias();
      getTipos();
      getTalles();
      getDirecciones();
      getOrdenes();
    }
  }, [token, role, navigate, getUsuarios, getProductos, getCategorias, getTipos, getTalles, getDirecciones, getOrdenes]);

  // render list by view
  const renderList = () => {
    console.log("=== DEBUG RENDERLIST ===");
    console.log("productos:", productos, "tipo:", typeof productos, "esArray:", Array.isArray(productos));
    console.log("categorias:", categorias, "tipo:", typeof categorias, "esArray:", Array.isArray(categorias));
    console.log("tipos:", tipos, "tipo:", typeof tipos, "esArray:", Array.isArray(tipos));
    console.log("talles:", talles, "tipo:", typeof talles, "esArray:", Array.isArray(talles));
    console.log("ordenes:", ordenes, "tipo:", typeof ordenes, "esArray:", Array.isArray(ordenes));
    console.log("usuarios:", usuarios, "tipo:", typeof usuarios, "esArray:", Array.isArray(usuarios));
    console.log("direcciones:", direcciones, "tipo:", typeof direcciones, "esArray:", Array.isArray(direcciones));
    
    switch (view) {
      case "Products":
        return Array.isArray(productos) && productos.length > 0 ? (
          productos.map((el) => {
            return (
              <ListCard
                key={el.id}
                variant="Products"
                id={el.id || "NN"}
                name={el.nombre}
                description={el.descripcion}
                price={el.precio}
                quantity={el.cantidad}
                color={el.color}
                category={el.categoria}
                sizes={el.tallesDisponibles}
                type={el.tipo}
                producto={el}
                onEdited={getProductos}
                onDeleted={getProductos}
                onRestored={getProductos}
              />
            );
          })
        ) : (
          <h3>No hay productos</h3>
        );

      case "Users":
        return Array.isArray(usuarios) && usuarios.length > 0 ? (
          usuarios.map((u) => (
            <ListCard
              key={u.id}
              variant="Users"
              id={u.id || "NN"}
              name={u.nombre}
              email={u.email}
              rol={u.rol}
              imagenPerfilPublicId={u.imagenPerfilPublicId}
              address={u.direcciones}
              usuario={u}
              onEdited={getUsuarios}
              onDeleted={getUsuarios}
              onRestored={getUsuarios}
            />
          ))
        ) : (
          <h3>No hay usuarios</h3>
        );

      case "Categories":
        return Array.isArray(categorias) && categorias.length > 0 ? (
          categorias.map((c) => (
            <ListCard
              key={c.id}
              variant="Categories"
              id={c.id || "NN"}
              name={c.nombre}
              category={c}
              onEdited={getCategorias}
              onDeleted={getCategorias}
              onRestored={getCategorias}
            />
          ))
        ) : (
          <h3>No hay categorías</h3>
        );

      case "Types":
        return Array.isArray(tipos) && tipos.length > 0 ? (
          tipos.map((t) => (
            <ListCard
              key={t.id}
              variant="Types"
              id={t.id || "NN"}
              name={t.nombre}
              categories={t.categorias ?? []}
              onEdited={getTipos}
              onDeleted={getTipos}
              onRestored={getTipos}
            />
          ))
        ) : (
          <h3>No hay tipos</h3>
        );

      case "Sizes":
        return Array.isArray(talles) && talles.length > 0 ? (
          talles.map((t) => (
            <ListCard
              key={t.id}
              variant="Sizes"
              id={t.id || "NN"}
              system={t.sistema}
              value={t.valor}
              sizes={[t]}
              onEdited={getTalles}
              onDeleted={getTalles}
              onRestored={getTalles}
            />
          ))
        ) : (
          <h3>No hay talles</h3>
        );

      case "Addresses":
        return Array.isArray(direcciones) && direcciones.length > 0 ? (
          direcciones.map((d) => {
            // Buscar si hay usuarios asignados a esta dirección
            const usuariosAsignados = usuarios.filter(u => 
              u.direcciones && u.direcciones.some(ud => ud.direccion.id === d.id)
            );
            
            return (
              <ListCard
                key={d.id}
                variant="Addresses"
                id={d.id || "NN"}
                street={d.calle}
                locality={d.localidad}
                pc={d.cp}
                usuario={usuariosAsignados.length > 0 ? usuariosAsignados[0] : undefined}
                activo={d.activo}
                onEdited={getDirecciones}
                onDeleted={getDirecciones}
                onRestored={getDirecciones}
              />
            );
          })
        ) : (
          <h3>No hay direcciones</h3>
        );

      case "Orders":
        return Array.isArray(ordenes) && ordenes.length > 0 ? (
          ordenes.map((o) => {
            // Calcular el total sumado de los productos si no viene del backend
            const total = o.precioTotal ?? (o.detalles?.reduce((sum, d) => sum + (d.producto?.precio || 0) * d.cantidad, 0) || 0);
            return (
              <ListCard
                key={o.id}
                variant="Orders"
                id={o.id || "NN"}
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
          onUserCreated={getUsuarios}
          onProductCreated={getProductos}
          onCategoryCreated={getCategorias}
          onTypeCreated={getTipos}
          onSizeCreated={getTalles}
          onAddressCreated={getDirecciones}
          onOrderCreated={getOrdenes}
        />
        <div className={styles.containerElelements}>{renderList()}</div>
      </div>
      <Footer />
    </div>
  );
};

// End of Admin component
