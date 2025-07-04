import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {  IUsuario } from "../types/IUsuario";

interface IUsuariostore {
  usuarios: IUsuario[];
  usuarioActivo: IUsuario | null;
  usuarioSeleccionado: IUsuario | null;
  setToken: (token: string | null) => void;
  setUsuarioActivo: (usuarioActivo: IUsuario | null) => void;
  setUsuarioSeleccionado: (usuarioSeleccionado: IUsuario | null) => void;
  setArrayUsuarios: (arrayDeUsuarios: IUsuario[]) => void;
  agregarNuevoUsuario: (nuevoUsuario: IUsuario) => void;
  editarUnUsuario: (usuarioActualizado: IUsuario) => void;
  eliminarUnUsuario: (idUsuario: number) => void;
  logOut: () => void;
}

export const usuarioStore = create<IUsuariostore>()(
  persist(
    (set, get) => ({
      usuarios: [],
      usuarioActivo: null,
      usuarioSeleccionado: null,

      setToken: (tokenIn) =>
        set((state) => ({
          usuarioActivo: state.usuarioActivo
            ? { ...state.usuarioActivo, token: tokenIn }
            : null,
        })),

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
            state.usuarioActivo?.id === idUsuario ? null : state.usuarioActivo,
        })),

        logOut: () => set({ usuarioActivo: null, usuarios: [] }),

        setUsuarioSeleccionado: (usuarioSeleccinadoIn) =>
        set({ usuarioSeleccionado: usuarioSeleccinadoIn }),
    }),
    {
      name: "usuario-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        usuarioActivo: state.usuarioActivo,
        usuarios: state.usuarios,
      }),
    }
  )
);
