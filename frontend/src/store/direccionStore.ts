import { create } from "zustand";
import { IUsuarioDireccion } from "../types/IUsuarioDireccion";
import { IDireccion } from "../types/IDireccion";


interface IUsuarioDireccionStore {
  direcciones: IUsuarioDireccion[] | [];
  direccionActiva: IUsuarioDireccion | null;
  setDireccionActiva: (direccionActiva: IUsuarioDireccion) => void;
  setArrayDirecciones: (arrayDeDirecciones: IUsuarioDireccion[]) => void;
  agregarNuevaDireccion: (nuevaDireccion: IUsuarioDireccion) => void;
  editarUnaDireccion: (direccionActualizada: IUsuarioDireccion) => void;
  eliminarUnaDireccion: ( idDireccion : number) => void;
}

interface IDireccionFisicaStore {
  direccionesFisicas: IDireccion[] | [];
  direccionFisicaActiva: IDireccion | null;
  setDireccionFisicaActiva: (direccionActiva: IDireccion) => void;
  setArrayDireccionesFisicas: (arrayDeDirecciones: IDireccion[]) => void;
  agregarNuevaDireccionFisica: (nuevaDireccion: IDireccion) => void;
  editarUnaDireccionFisica: (direccionActualizada: IDireccion) => void;
  eliminarUnaDireccionFisica: (idDireccion: number) => void;
}

export const direccionStore = create<IUsuarioDireccionStore>((set) => ({
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

export const direccionFisicaStore = create<IDireccionFisicaStore>((set) => ({
  direccionesFisicas: [],
  direccionFisicaActiva: null,

  // Agregar array
  setArrayDireccionesFisicas: (direccionesIn) => set(() => ({ direccionesFisicas: direccionesIn })),

  // Agregar una dirección física
  agregarNuevaDireccionFisica: (nuevaDireccion) =>
    set((state) => ({ direccionesFisicas: [...state.direccionesFisicas, nuevaDireccion] })),

  // Editar una dirección física
  editarUnaDireccionFisica: (direccionActualizada) =>
    set((state) => {
      const arregloDirecciones = state.direccionesFisicas.map((direccion) =>
        direccion.id === direccionActualizada.id
          ? { ...direccion, ...direccionActualizada }
          : direccion
      );
      return { direccionesFisicas: arregloDirecciones };
    }),

  // Eliminar una dirección física del array
  eliminarUnaDireccionFisica: (idDireccion) => set((state) => {
    const arregloDirecciones = state.direccionesFisicas.filter((direccion) => direccion.id !== idDireccion);
    return { direccionesFisicas: arregloDirecciones };
  }),

  // Setear dirección física activa
  setDireccionFisicaActiva: (direccionActivaIn) =>
    set(() => ({ direccionFisicaActiva: direccionActivaIn })),
}));
