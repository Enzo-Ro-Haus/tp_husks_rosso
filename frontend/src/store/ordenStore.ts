import { create } from "zustand";
import { IOrden } from "../types/IOrden";

interface IOrdenStore {
  ordenes: IOrden[];
  ordenActiva: IOrden | null;
  //fetchordenes: ( ) => number
  setOrdenActiva: (ordenActiva: IOrden) => void;
  setArrayOrdenes: (arrayDeOrdenes: IOrden[]) => void;
  agregarNuevaOrden: (nuevaOrden: IOrden) => void;
  editarUnaOrden: (ordenActualizada: IOrden) => void;
  eliminarUnaOrden: (idOrden: number) => void;
}

export const ordenStore = create<IOrdenStore>((set) => ({
  ordenes: [],
  ordenActiva: null,

  // Agregar array
  setArrayOrdenes: (ordenesIn) => set(() => ({ ordenes: ordenesIn })),

  // Agregar un ordenes
  agregarNuevaOrden: (nuevaOrden) =>
    set((state) => ({ ordenes: [...state.ordenes, nuevaOrden] })),

  // Editar un ordenes
  editarUnaOrden: (ordeneEditada) =>
    set((state) => {
      const arregloOrdenes = state.ordenes.map((ordenes) =>
        ordenes.id === ordeneEditada.id
          ? { ...ordenes, ordeneEditada }
          : ordenes
      );
      return { ordenes: arregloOrdenes };
    }),

  // Eliminar un ordenes del array
   eliminarUnaOrden: (idOrden) => set((state) => {
    const arregloOrdenes = state.ordenes.filter((ordenes) => ordenes.id !== idOrden);
    return { ordenes: arregloOrdenes };  
   }),

  // Setear ordenes activo
  setOrdenActiva: (ordenActivaIn) =>
    set(() => ({ ordenActiva: ordenActivaIn })),
}));
