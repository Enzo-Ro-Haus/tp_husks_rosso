import axios from "axios";
import { ITipo } from "../types/ITipo";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const getAllTipos = async (token: string | null): Promise<ITipo[]> => {
  const { data } = await axios.get<ITipo[]>(`${API_URL}/tipo`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createTipo = async (
  token: string | null,
  nuevoTipo: ITipo
): Promise<ITipo> => {
  const payload: any = { nombre: nuevoTipo.nombre };
  if (nuevoTipo.categorias && nuevoTipo.categorias.length > 0) {
    payload.categorias = nuevoTipo.categorias.map(c => ({ id: c.id }));
  }
  const { data } = await axios.post<ITipo>(`${API_URL}/tipo`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Tipo creado",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const updateTipo = async (
  token: string | null,
  id: number,
  tipoUpdated: Partial<ITipo>
): Promise<ITipo> => {
  const payload: any = { nombre: tipoUpdated.nombre };
  if (tipoUpdated.categorias && tipoUpdated.categorias.length > 0) {
    payload.categorias = tipoUpdated.categorias.map(c => ({ id: c.id }));
  }
  const { data } = await axios.put<ITipo>(
    `${API_URL}/tipo/${id}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  Swal.fire({
    icon: "success",
    title: "Tipo actualizado",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const deleteTipo = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.delete(`${API_URL}/tipo/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Tipo eliminado",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const softDeleteTipo = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/tipo/soft-delete/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Tipo dado de baja (soft delete)",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const restoreTipo = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/tipo/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Tipo restaurado",
    text: `Tipo ID ${id} restaurado exitosamente.`,
    timer: 2000,
    showConfirmButton: false,
  });
};
