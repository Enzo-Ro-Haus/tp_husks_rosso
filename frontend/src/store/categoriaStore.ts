import { create } from "zustand";
import { ICategoria } from "../types/ICategoria";


interface Icategoriastore {
  categorias: ICategoria[] | [];
  categoriaActiva: ICategoria | null;
  //fetchcategorias: ( ) => number
  setcategoriaActiva: (categoriaActiva: ICategoria) => void;
  setArraycategorias: (arrayDecategorias: ICategoria[]) => void;
  agregarNuevaCategiria: (nuevaCategoria: ICategoria) => void;
  editarUnaCategoria: (categoriaActualizada: ICategoria) => void;
  eliminarUnaCategoria: ( idCategoria : number) => void;
}

export const categoriaStore = create<Icategoriastore>((set) => ({
  categorias: [],
  categoriaActiva: null,

  // Agregar array
  setArraycategorias: (categoriasIn) => set(() => ({ categorias: categoriasIn })),

  // Agregar un categoria
  agregarNuevaCategiria: (nuevaCategoria) =>
    set((state) => ({ categorias: [...state.categorias, nuevaCategoria] })),

  // Editar un categoria
  editarUnaCategoria: (categoriaEditado) =>
    set((state) => {
      const arreglocategorias = state.categorias.map((categoria) =>
        categoria.id === categoriaEditado.id
          ? { ...categoriaEditado }
          : categoria
      );
      return { categorias: arreglocategorias };
    }),

  // Eliminar un categoria del array
   eliminarUnaCategoria: ( idCategoria ) => set((state) => {
    const arreglocategorias = state.categorias.filter((categoria) => categoria.id !== idCategoria );
    return { categorias: arreglocategorias };  
   }),

  // Setear categoria activo
  setcategoriaActiva: (categoriaActivaIn) =>
    set(() => ({ categoriaActiva: categoriaActivaIn })),
}));
