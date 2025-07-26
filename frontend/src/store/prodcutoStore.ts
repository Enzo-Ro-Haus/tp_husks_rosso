import { create } from "zustand";
import { IProducto } from "../types/IProducto";

interface IProductoStore {
  productos: IProducto[];
  productoActivo: IProducto | null;
  //fetchProductos: ( ) => number
  setProductoActivo: (productoActivo: IProducto) => void;
  setArrayProductos: (arrayDeProductos: IProducto[]) => void;
  agregarNuevoProducto: (nuevoProducto: IProducto) => void;
  editarUnProducto: (productoActualizado: IProducto) => void;
  eliminarUnProducto: (idProducto: number) => void;
}

export const productoStore = create<IProductoStore>((set) => ({
  productos: [],
  productoActivo: null,

  // Agregar array
  setArrayProductos: (productosIn) => {
    console.log('🔍 setArrayProductos llamado con:', productosIn);
    console.log('🔍 setArrayProductos - length:', productosIn ? productosIn.length : 0);
    set(() => ({ productos: productosIn }));
  },

  // Agregar un producto
  agregarNuevoProducto: (nuevoProducto) => {
    console.log('🔍 agregarNuevoProducto llamado con:', nuevoProducto);
    set((state) => {
      console.log('🔍 agregarNuevoProducto - state actual:', state.productos);
      const newState = { productos: [...state.productos, nuevoProducto] };
      console.log('🔍 agregarNuevoProducto - nuevo state:', newState.productos);
      return newState;
    });
  },

  // Editar un producto
  editarUnProducto: (productoEditado) =>
    set((state) => {
      const arregloProductos = state.productos.map((producto) =>
        producto.id === productoEditado.id
          ? { ...producto, productoEditado }
          : producto
      );
      return { productos: arregloProductos };
    }),

  // Eliminar un producto del array
   eliminarUnProducto: (idProducto) => set((state) => {
    const arregloProductos = state.productos.filter((producto) => producto.id !== idProducto);
    return { productos: arregloProductos };  
   }),

  // Setear producto activo
  setProductoActivo: (productoActivoIn) =>
    set(() => ({ productoActivo: productoActivoIn })),
}));
