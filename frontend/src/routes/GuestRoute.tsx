import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usuarioStore } from "../store/usuarioStore";

interface Props {
  children: ReactNode;
}

export const GuestRoute = ({ children }: Props) => {
  const usuario = usuarioStore((s) => s.usuarioActivo);
  if (usuario) {
    if (usuario.rol === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (usuario.rol === "CLIENTE") {
      return <Navigate to="/client" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  return <>{children}</>;
}; 