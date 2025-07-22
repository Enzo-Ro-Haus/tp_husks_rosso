import axios from "axios";
import Swal from "sweetalert2";
import { IUsuarioDireccion } from "../types/IUsuarioDireccion";
import { IDireccion } from "../types/IDireccion";

const API_URL = "http://localhost:9000";

export const getAllUsuarioDirecciones = async (
  token: string | null
): Promise<IUsuarioDireccion[]> => {
  const { data } = await axios.get<IUsuarioDireccion[]>(
    `${API_URL}/usuario-direccion`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const getActiveUsuarioDirecciones = async (
  token: string | null
): Promise<IUsuarioDireccion[]> => {
  const { data } = await axios.get<IUsuarioDireccion[]>(
    `${API_URL}/usuario-direccion/active`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const getAllDirecciones = async (
  token: string | null
): Promise<IDireccion[]> => {
  const { data } = await axios.get<IDireccion[]>(
    `${API_URL}/direccion`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const createUsuarioDireccion = async (
  token: string | null,
  nueva: IUsuarioDireccion
): Promise<IUsuarioDireccion> => {
  try {
    const { data } = await axios.post<IUsuarioDireccion>(
      `${API_URL}/usuario-direccion/relacion`,
      nueva,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire({
      icon: "success",
      title: "Dirección asignada",
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error('Error asignando dirección:', error);
    if (error.response?.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Error de permisos",
        text: "No tienes permisos para asignar direcciones. Contacta al administrador.",
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error inesperado al asignar la dirección",
        timer: 3000,
        showConfirmButton: false,
      });
    }
    throw error;
  }
};

export const updateUsuarioDireccion = async (
  token: string | null,
  id: number,
  direccionUpdated: Partial<IUsuarioDireccion>
): Promise<IUsuarioDireccion> => {
  const { data } = await axios.put<IUsuarioDireccion>(
    `${API_URL}/usuario-direccion/${id}`,
    direccionUpdated,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  Swal.fire({
    icon: "success",
    title: "Asignación actualizada",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const deleteUsuarioDireccion = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.delete(`${API_URL}/usuario-direccion/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Asignación eliminada",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const softDeleteUsuarioDireccion = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/usuario-direccion/soft-delete/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const restoreUsuarioDireccion = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/usuario-direccion/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Dirección restaurada",
    text: `Dirección ID ${id} restaurada exitosamente.`,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const createDireccion = async (
  token: string | null,
  nuevaDireccion: IDireccion
): Promise<IDireccion> => {
  try {
    const { data } = await axios.post<IDireccion>(
      `${API_URL}/direccion`,
      nuevaDireccion,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire({
      icon: "success",
      title: "Dirección creada",
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error('Error creando dirección:', error);
    if (error.response?.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Error de permisos",
        text: "No tienes permisos para crear direcciones. Contacta al administrador.",
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error inesperado al crear la dirección",
        timer: 3000,
        showConfirmButton: false,
      });
    }
    throw error;
  }
};

export const updateDireccion = async (
  token: string | null,
  id: number,
  direccionUpdated: Partial<IDireccion>
): Promise<IDireccion> => {
  const { data } = await axios.put<IDireccion>(
    `${API_URL}/direccion/${id}`,
    direccionUpdated,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  Swal.fire({
    icon: "success",
    title: "Dirección actualizada",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const getMisUsuarioDirecciones = async (
  token: string | null
): Promise<IUsuarioDireccion[]> => {
  const { data } = await axios.get<IUsuarioDireccion[]>(
    `${API_URL}/usuario-direccion/mias`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
