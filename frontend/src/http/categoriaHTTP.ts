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
  nombreCategoria: string,
  tiposIds: number[]
): Promise<ICategoria> => {
  console.log('=== DEBUG CREATE CATEGORIA ===');
  console.log('Token:', token);
  console.log('Nombre:', nombreCategoria);
  console.log('Tipos seleccionados:', tiposIds);
  console.log('Headers:', { Authorization: `Bearer ${token}` });
  console.log('URL:', `${API_URL}/categoria`);
  console.log('==============================');

  // 1. Crear la categoría solo con el nombre (sin tipos)
  const payload: any = { nombre: nombreCategoria };
  const { data } = await axios.post<ICategoria>(
    `${API_URL}/categoria`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  // 2. Crear la relación explícita para cada tipo seleccionado
  for (const tipoId of tiposIds) {
    if (data.id !== undefined && tipoId !== undefined) {
      await createCategoriaTipoRelation(token, data.id, tipoId);
    }
  }
  // 3. Obtener la categoría actualizada con sus relaciones
  const categoriasActualizadas = await getAllCategorias(token);
  const categoriaFinal = categoriasActualizadas.find((c) => c.id === data.id) || data;
  Swal.fire({
    icon: "success",
    title: "Categoría creada",
    timer: 2000,
    showConfirmButton: false,
  });
  return categoriaFinal;
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
