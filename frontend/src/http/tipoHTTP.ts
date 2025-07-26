import axios from "axios";
import { ITipo } from "../types/ITipo";
import Swal from "sweetalert2";
import { createCategoriaTipoRelation } from "./categoriaHTTP";

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
  // Si hay categorías sin id, primero créalas y reemplaza por sus ids
  let categoriasFinal = [];
  if (nuevoTipo.categorias && nuevoTipo.categorias.length > 0) {
    for (const c of nuevoTipo.categorias) {
      if (!c.id && c.nombre) {
        // Crear categoría nueva
        const categoriaCreada = await (await import('./categoriaHTTP')).createCategoria(token, { nombre: c.nombre, tipos: [] });
        if (categoriaCreada && categoriaCreada.id) {
          categoriasFinal.push({ id: categoriaCreada.id });
        }
      } else if (c.id) {
        categoriasFinal.push({ id: c.id });
      }
    }
  }
  const payload: any = { nombre: nuevoTipo.nombre };
  payload.categorias = categoriasFinal;
  const { data } = await axios.post<ITipo>(`${API_URL}/tipo`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Sincroniza relaciones explícitas
  for (const c of categoriasFinal) {
    if (data.id !== undefined && c.id !== undefined) {
      await createCategoriaTipoRelation(token, c.id, data.id);
    }
  }
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
  // Permitir que categorias sea un array de IDs o de objetos
  payload.categorias = (tipoUpdated.categorias || []).map((c: any) =>
    typeof c === 'object' && c.id ? { id: c.id } : { id: c }
  ); // Siempre enviar array de objetos {id}
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
};

export const restoreTipo = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/tipo/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
