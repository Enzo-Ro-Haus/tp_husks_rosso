import { create } from "zustand";
import { ITalle } from "../types/ITalle";


interface ITalleStore {
  talles: ITalle[] | [];
  talleActivo: ITalle | null;
  setTalleActivo: (talleActivo: ITalle) => void;
  setArrayTalles: (arrayDeTalles: ITalle[]) => void;
  agregarNuevoTalle: (nuevoTalle: ITalle) => void;
  editarUnTalle: (talleActializado: ITalle) => void;
  eliminarUnTalle: ( idTalle : number) => void;
}

export const talleStore = create<ITalleStore>((set) => ({
  talles: [],
  talleActivo: null,

  // Agregar array
  setArrayTalles: (tallesIn) => set(() => ({ talles: tallesIn })),

  // Agregar un talle
  agregarNuevoTalle: (nuevoTalle) =>
    set((state) => ({ talles: [...state.talles, nuevoTalle] })),

  // Editar un talle
  editarUnTalle: (talleEditato) =>
    set((state) => {
      const arregloTalles = state.talles.map((talle) =>
        talle.id === talleEditato.id
          ? { ...talle, talleEditato }
          : talle
      );
      return { talles: arregloTalles };
    }),

  // Eliminar un talle del array
   eliminarUnTalle: ( idTalle ) => set((state) => {
    const arregloTalles = state.talles.filter((talle) => talle.id !== idTalle );
    return { talles: arregloTalles };  
   }),

  // Setear talle activo
  setTalleActivo: (talleActivoIn) =>
    set(() => ({ talleActivo: talleActivoIn })),
}));
