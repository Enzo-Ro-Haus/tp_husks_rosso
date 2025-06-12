import { create } from "zustand";
import { IDireccion } from "../types/IDireccion";

interface IDireccionStore {
  direcciones: IDireccion[] | [];
  direccionActiva: IDireccion | null;
  setDireccionActiva: (direccionActiva: IDireccion) => void;
  setArrayDirecciones: (arrayDeDirecciones: IDireccion[]) => void;
  agregarNuevaDireccion: (nuevaDireccion: IDireccion) => void;
  editarUnaDireccion: (direccionActualizada: IDireccion) => void;
  eliminarUnaDireccion: ( idDireccion : number) => void;
}

export const direccionStore = create<IDireccionStore>((set) => ({
  direcciones: [],
  direccionActiva: null,

  // Agregar array
  setArrayDirecciones: (direccionesIn) => set(() => ({ direcciones: direccionesIn })),

  // Agregar un direccion
  agregarNuevaDireccion: (nuevaDireccion) =>
    set((state) => ({ direcciones: [...state.direcciones, nuevaDireccion] })),

  // Editar un direccion
  editarUnaDireccion: (direccionEditada) =>
    set((state) => {
      const arregloDirecciones = state.direcciones.map((direccion) =>
        direccion.id === direccionEditada.id
          ? { ...direccion, direccionEditada }
          : direccion
      );
      return { direcciones: arregloDirecciones };
    }),

  // Eliminar un direccion del array
   eliminarUnaDireccion: ( idDireccion ) => set((state) => {
    const arregloDirecciones = state.direcciones.filter((direccion) => direccion.id !== idDireccion );
    return { direcciones: arregloDirecciones };  
   }),

  // Setear direccion activo
  setDireccionActiva: (direccionActivaIn) =>
    set(() => ({ direccionActiva: direccionActivaIn })),
}));
