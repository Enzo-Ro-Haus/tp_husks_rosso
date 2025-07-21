import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usuarioStore } from "../store/usuarioStore";

interface Props {
  children: ReactNode;
}

export const GuestRoute = ({ children }: Props) => {
  const usuario = usuarioStore((s) => s.usuarioActivo);
  if (usuario) {
    return <Navigate to="/client" replace />;
  }
  return <>{children}</>;
}; 