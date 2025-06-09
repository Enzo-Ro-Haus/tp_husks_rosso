import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUsuario } from "../types/IUsuario";

interface IUsuariostore {
  usuarios: IUsuario[];
  usuarioActivo: IUsuario | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setUsuarioActivo: (usuarioActivo: IUsuario) => void;
  setArrayUsuarios: (arrayDeUsuarios: IUsuario[]) => void;
  agregarNuevoUsuario: (nuevoUsuario: IUsuario) => void;
  editarUnUsuario: (usuarioActualizado: IUsuario) => void;
  eliminarUnUsuario: (idUsuario: number) => void;
}

export const usuarioStore = create<IUsuariostore>()(
  persist(
    (set, get) => ({
      usuarios: [],
      usuarioActivo: null,
      token: null,

      setToken: (tokenIn) => set({ token: tokenIn }),

      setUsuarioActivo: (usuarioActivoIn) =>
        set({ usuarioActivo: usuarioActivoIn }),

      setArrayUsuarios: (UsuariosIn) => set({ usuarios: UsuariosIn }),

      agregarNuevoUsuario: (nuevoUsuario) =>
        set((state) => ({ usuarios: [...state.usuarios, nuevoUsuario] })),

      editarUnUsuario: (usuarioEditado) =>
        set((state) => ({
          usuarios: state.usuarios.map((u) =>
            u.id === usuarioEditado.id ? usuarioEditado : u
          ),
          usuarioActivo:
            state.usuarioActivo?.id === usuarioEditado.id
              ? usuarioEditado
              : state.usuarioActivo,
        })),

      eliminarUnUsuario: (idUsuario) =>
        set((state) => ({
          usuarios: state.usuarios.filter((u) => u.id !== idUsuario),
          usuarioActivo:
            state.usuarioActivo?.id === idUsuario
              ? null
              : state.usuarioActivo,
        })),
    }),
    {
      name: "usuario-storage", // clave en storage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        usuarioActivo: state.usuarioActivo,
      }),
    }
  )
);
