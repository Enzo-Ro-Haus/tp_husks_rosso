import axios from "axios";
import { IAuthResponse, IUsuario } from "../types/IUsuario";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const registrarUsuario = async (
  nuevoUsuario: IUsuario & { direcciones?: any[] }
): Promise<IAuthResponse> => {
  try {
    const payload: any = {
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      password: nuevoUsuario.password,
    };
    if (nuevoUsuario.imagenPerfilPublicId && nuevoUsuario.imagenPerfilPublicId.trim() !== "") {
      payload.imagenPerfilPublicId = nuevoUsuario.imagenPerfilPublicId;
    }
    // Agregar direcciones al payload si existen
    if (nuevoUsuario.direcciones && nuevoUsuario.direcciones.length > 0) {
      payload.direcciones = nuevoUsuario.direcciones;
    }
    
    const { data } = await axios.post<IAuthResponse>(
      `${API_URL}/public/register`,
      payload
    );
    Swal.fire({
      icon: "success",
      title: "Usuario registrado",
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error("[registrarUsuario] Error:", error);
    // Re-throw the error so the component can handle it
    throw error;
  }
};

export const loginUsuario = async (
  email: string,
  password: string
): Promise<IAuthResponse> => {
  try {
    const { data } = await axios.post<IAuthResponse>(`${API_URL}/public/login`, {
      email,
      password,
    });
    return data;
  } catch (error: any) {
    console.error("[loginUsuario] Error:", error);
    // Re-throw the error so the component can handle it
    throw error;
  }
};

export const getAllUsuarios = async (
  token: string | null
): Promise<IUsuario[]> => {
  try {
  const { data } = await axios.get<IUsuario[]>(`${API_URL}/usuario`, {
    headers: { Authorization: `Bearer ${token}` },
  });
    console.log("[getAllUsuarios] Respuesta del backend:", data);
  return data;
  } catch (error: any) {
    if (error.response) {
      console.error("[getAllUsuarios] Error de respuesta:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("[getAllUsuarios] No hubo respuesta del backend:", error.request);
    } else {
      console.error("[getAllUsuarios] Error desconocido:", error.message);
    }
    return [];
  }
};

export const getUsuarioActual = async (
  token: string | null
): Promise<IUsuario> => {
  const { data } = await axios.get<IUsuario>(`${API_URL}/usuario/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateUsuario = async (
  token: string | null,
  id: number,
  usuarioUpdated: Partial<IUsuario>
): Promise<IUsuario> => {
  const { data } = await axios.put<IUsuario>(
    `${API_URL}/usuario/${id}`,
    usuarioUpdated,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  Swal.fire({
    icon: "success",
    title: "Usuario actualizado",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const deleteUsuario = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.delete(`${API_URL}/usuario/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Usuario eliminado",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const softDeleteUsuario = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/usuario/soft-delete/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Usuario dado de baja (soft delete)",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const restoreUsuario = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/usuario/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Usuario restaurado",
    text: `Usuario ID ${id} restaurado exitosamente.`,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const corregirRolAdmin = async (
  token: string | null,
  id: number
): Promise<IUsuario> => {
  const { data } = await axios.patch<IUsuario>(
    `${API_URL}/usuario/${id}/corregir-rol-admin`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  Swal.fire({
    icon: "success",
    title: "Rol de admin corregido",
    text: `Usuario ID ${id} ahora tiene rol ADMIN.`,
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};
