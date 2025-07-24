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
  eliminarDetalle: (productoId: number) => void;
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
        set((state) => {
          const index = state.detalles.findIndex(
            (d) => d.producto.id === nuevoDetalle.producto.id
          );
          if (index !== -1) {
            // Si ya existe, sumamos la cantidad
            const detallesActualizados = state.detalles.map((d, i) =>
              i === index
                ? { ...d, cantidad: d.cantidad + nuevoDetalle.cantidad }
                : d
            );
            return { detalles: detallesActualizados };
          } else {
            // Si no existe, lo agregamos
            return { detalles: [...state.detalles, nuevoDetalle] };
          }
        }),

      //Calcula el total de la orden
      setTotal: (detalles) => {
        const sumTotal = detalles.reduce(
          (acc, det) => acc + det.cantidad * det.producto.precio,
          0
        );
        set({ total: sumTotal });
      },

      // Eliminar un detalle del carrito por id de producto
      eliminarDetalle: (productoId) =>
        set((state) => ({ detalles: state.detalles.filter((d) => d.producto.id !== productoId) })),
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
