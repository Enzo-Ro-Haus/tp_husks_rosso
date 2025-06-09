import { useEffect } from "react";
import { getAllProductos } from "../../../http/productoHTTP";
import { productoStore } from "../../../store/prodcutoStore";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "../GenericStyle.module.css";
import style2 from "./Catalog.module.css";
import { ClotheCard } from "../../ui/Card/ClotheCard/ClotheCard";

export const Catalog = () => {

 const productos = productoStore((state) => state.productos);
  const setArrayProductos = productoStore((state) => state.setArrayProductos);

  const getProductos = async () => {
    const data = await getAllProductos();
    if (data) setArrayProductos(data);
  };

  useEffect(() => {
    getProductos();
  }, []);
  
  return (
   <div className={style.containerPrincipalPage}> 
      <Header />
      <div className={style2.containerProducts}>
        {productos.length > 0 ? (
          productos
            .map((el) => (
              <ClotheCard
                name={el.nombre}
                description={el.descripcion}
                price={el.precio}
              />
            ))
        ) : (
          <div>
            <h3>No hay productos</h3>
          </div>
        )}
      </div>
      <Footer /> 
    </div>
  );
};
