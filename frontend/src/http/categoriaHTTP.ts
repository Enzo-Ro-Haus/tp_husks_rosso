import axios from "axios";
import { ICategoria } from "../types/ICategoria";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const getAllCategorias = async (
  token: string | null
): Promise<ICategoria[]> => {
  try {
    console.log("=== DEBUG getAllCategorias ===");
    console.log("Token:", token ? "Present" : "Missing");
    console.log("URL:", `${API_URL}/categoria`);
    
    const response = await axios.get<ICategoria[]>(`${API_URL}/categoria`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    console.log("Response data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
    
    return response.data;
  } catch (error: any) {
    console.error("=== DEBUG getAllCategorias ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    return [];
  }
};

// Relación explícita Categoria-Tipo
export const createCategoriaTipoRelation = async (token: string | null, categoriaId: number, tipoId: number) => {
  await axios.post(
    `http://localhost:9000/categoria-tipo?categoriaId=${categoriaId}&tipoId=${tipoId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteCategoriaTipoRelation = async (token: string | null, categoriaId: number, tipoId: number) => {
  await axios.delete(
    `http://localhost:9000/categoria-tipo?categoriaId=${categoriaId}&tipoId=${tipoId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Modifica createCategoria para sincronizar relaciones explícitas
export const createCategoria = async (
  token: string | null,
  nuevaCategoria: ICategoria
): Promise<ICategoria> => {
  console.log('=== DEBUG CREATE CATEGORIA ===');
  console.log('Token:', token);
  console.log('Payload completo:', JSON.stringify(nuevaCategoria, null, 2));
  console.log('Headers:', { Authorization: `Bearer ${token}` });
  console.log('URL:', `${API_URL}/categoria`);
  console.log('==============================');

  // Si hay tipos sin id, primero créalos y reemplaza por sus ids
  let tiposFinal = [];
  if (nuevaCategoria.tipos && nuevaCategoria.tipos.length > 0) {
    for (const t of nuevaCategoria.tipos) {
      if (!t.id && t.nombre) {
        // Crear tipo nuevo
        const tipoCreado = await (await import('./tipoHTTP')).createTipo(token, { nombre: t.nombre, categorias: [] });
        if (tipoCreado && tipoCreado.id) {
          tiposFinal.push({ id: tipoCreado.id });
        }
      } else if (t.id) {
        tiposFinal.push({ id: t.id });
      }
    }
  }
  const payload: any = { nombre: nuevaCategoria.nombre };
  payload.tipos = tiposFinal;
  const { data } = await axios.post<ICategoria>(
    `${API_URL}/categoria`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  // Sincroniza relaciones explícitas
  for (const t of tiposFinal) {
    if (data.id !== undefined && t.id !== undefined) {
      await createCategoriaTipoRelation(token, data.id, t.id);
    }
  }
  Swal.fire({
    icon: "success",
    title: "Categoría creada",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const updateCategoria = async (
  token: string | null,
  id: number,
  categoriaUpdated: Partial<ICategoria>
): Promise<ICategoria> => {
  const payload: any = { nombre: categoriaUpdated.nombre };
  payload.tipos = (categoriaUpdated.tipos || []).map(t => ({ id: t.id })); // Siempre enviar array
  const { data } = await axios.put<ICategoria>(
    `${API_URL}/categoria/${id}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  Swal.fire({
    icon: "success",
    title: "Categoría actualizada",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const deleteCategoria = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.delete(`${API_URL}/categoria/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Categoría eliminada",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const softDeleteCategoria = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/categoria/soft-delete/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const restoreCategoria = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/categoria/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
