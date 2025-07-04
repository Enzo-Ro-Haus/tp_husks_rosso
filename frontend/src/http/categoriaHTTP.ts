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
  
  const payload: any = { nombre: nuevaCategoria.nombre };
  if (nuevaCategoria.tipos && nuevaCategoria.tipos.length > 0) {
    payload.tipos = nuevaCategoria.tipos.map(t => ({ id: t.id }));
  }
  const { data } = await axios.post<ICategoria>(
    `${API_URL}/categoria`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
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
  if (categoriaUpdated.tipos && categoriaUpdated.tipos.length > 0) {
    payload.tipos = categoriaUpdated.tipos.map(t => ({ id: t.id }));
  }
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
  Swal.fire({
    icon: "success",
    title: "Categoría dada de baja (soft delete)",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const restoreCategoria = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/categoria/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Categoría restaurada",
    text: `Categoría ID ${id} restaurada exitosamente.`,
    timer: 2000,
    showConfirmButton: false,
  });
};
