// src/routes/ProtectedRoute.tsx
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usuarioStore } from "../store/usuarioStore";

interface Props {
  children: ReactNode;
  rolesPermitidos: string[];
}

export const ProtectedRoute = ({ children, rolesPermitidos }: Props) => {
  const usuario = usuarioStore((s) => s.usuarioActivo);
  const location = useLocation();

  useEffect(() => {
    console.log("🔒 ProtectedRoute - Usuario:", usuario);
    console.log("🔒 ProtectedRoute - Usuario.rol:", usuario?.rol, typeof usuario?.rol);
    console.log("🔒 ProtectedRoute - Roles permitidos:", rolesPermitidos);
    console.log("🔒 ProtectedRoute - Ruta actual:", location.pathname);
    if (usuario && usuario.rol) {
      console.log("🔒 ProtectedRoute - rolesPermitidos.includes(usuario.rol):", rolesPermitidos.includes(usuario.rol));
    }
  }, [usuario, rolesPermitidos, location.pathname]);

  //No logueado, lo mandamos al login
  if (!usuario) {
    console.log("🔒 ProtectedRoute - No hay usuario, redirigiendo a login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no tiene rol definido o su rol no está en la lista, lo mandamos al NotFound
  if (!usuario.rol || !rolesPermitidos.includes(usuario.rol)) {
    console.log("🔒 ProtectedRoute - Rol no permitido:", usuario.rol);
    return <Navigate to="/*" replace />;
  }

  // Si todo está bien, renderizamos el contenido protegido
  console.log("🔒 ProtectedRoute - Acceso permitido");
  return <>{children}</>;
};