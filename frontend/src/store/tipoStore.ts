import { create } from "zustand";
import { ITipo } from "../types/ITipo";


interface ITipoStore {
  tipos: ITipo[] | [];
  tipoActivo: ITipo | null;
  setTipoActivo: (tipoActivo: ITipo) => void;
  setArrayTipos: (arrayDetipos: ITipo[]) => void;
  agregarNuevoTipo: (nuevoTipo: ITipo) => void;
  editarUnTipo: (tipoActializado: ITipo) => void;
  eliminarUnTipo: ( idTipo : number) => void;
}

export const tipoStore = create<ITipoStore>((set) => ({
  tipos: [],
  tipoActivo: null,

  // Agregar array
  setArrayTipos: (tiposIn) => set(() => ({ tipos: tiposIn })),

  // Agregar un tipo
  agregarNuevoTipo: (nuevoTipo) =>
    set((state) => ({ tipos: [...state.tipos, nuevoTipo] })),

  // Editar un tipo
  editarUnTipo: (tipoEditado) =>
    set((state) => {
      const arreglotipos = state.tipos.map((tipo) =>
        tipo.id === tipoEditado.id
          ? { ...tipo, tipoEditado }
          : tipo
      );
      return { tipos: arreglotipos };
    }),

  // Eliminar un tipo del array
   eliminarUnTipo: ( idTipo ) => set((state) => {
    const arreglotipos = state.tipos.filter((tipo) => tipo.id !== idTipo );
    return { tipos: arreglotipos };  
   }),

  // Setear tipo activo
  setTipoActivo: (tipoActivoIn) =>
    set(() => ({ tipoActivo: tipoActivoIn })),
}));
