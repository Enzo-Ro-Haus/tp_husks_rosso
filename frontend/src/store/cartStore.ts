import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IAuthResponse, IUsuario } from "../types/IUsuario";
import { IDetalle } from "../types/IDetalle";
import { IOrden } from "../types/IOrden";

interface ICartStore {
  total: number;
  orden: IOrden | null;
  detalles: IDetalle[];
  detalleActivo: IDetalle | null;
  setOrden: (orden: IOrden) => void;
  agregarDetalle: (detalle: IDetalle) => void;
  editarDetalle : (detalle: IDetalle) => void;
  setTotal: (detalles: IDetalle[]) => void;
}

export const cartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      total: 0,
      orden: null,
      detalles: [],
      detalleActivo: null,

      editarDetalle: (detalleEditado) =>
        set((state) => ({
          detalles: state.detalles.map((d) =>
            d.id === detalleEditado.id ? detalleEditado : d
          ),
          detalleActivo:
            state.detalleActivo?.id === detalleEditado.id
              ? detalleEditado
              : state.detalleActivo,
        })),

      //Guarda ls orden creado
      setOrden: (ordenIn) => set({ orden: ordenIn }),
        
      //Los detalles de la orden
      agregarDetalle: (nuevoDetalle) =>
        set((state) => ({ detalles: [...state.detalles, nuevoDetalle] })),

      //Calcula el total de la orden
      setTotal: (detalles) => {
        const sumTotal = detalles.reduce(
          (acc, det) => acc + det.cantidad * det.producto.precio,
          0
        );
        set({ total: sumTotal });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orden: state.orden,
        detalles: state.detalles,
      }),
    }
  )
);
