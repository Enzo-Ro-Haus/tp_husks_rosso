// src/routes/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usuarioStore } from "../store/usuarioStore";

interface Props {
  children: ReactNode;
  rolesPermitidos: string[];
}

export const ProtectedRoute = ({ children, rolesPermitidos }: Props) => {
  const usuario = usuarioStore((s) => s.usuarioActivo);
  const location = useLocation();

  //No logueado, lo mandamos al login
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no tiene rol definido o su rol no está en la lista, lo mandamos al NotFound
  if (!usuario.rol || !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/*" replace />;
  }

  // Si todo está bien, renderizamos el contenido protegido
  return <>{children}</>;
};