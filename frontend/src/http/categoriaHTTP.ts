import axios from "axios";
import { ICategoria } from "../types/ICategoria";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const createCategoria = async (
  token: string | null,
  nuevaCategoria: ICategoria
): Promise<ICategoria | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }

  try {
    const { data } = await axios.post<ICategoria>(
      `${API_URL}/private/categorias`,
      nuevaCategoria,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Categoría creada",
      text: `Se creó correctamente la categoría "${data.nombre}".`,
      timer: 2000,
      showConfirmButton: false,
    });

    console.log("✅ Categoría creada:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error al crear categoría:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo crear la categoría "${nuevaCategoria.nombre}".`,
    });
    return null;
  }
};

export const getAllCategorias = async (
  token: string | null
): Promise<ICategoria[]> => {
  try {
    const response = await axios.get<ICategoria[]>(
      `${API_URL}/public/categoria`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Categotrías recibidas:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener categorias:",
      error.response?.data || error
    );
    return [];
  }
};

export const updateCategoria = async (
  token: string | null,
  id: number,
  categoriaUpdated: Partial<ICategoria>
): Promise<ICategoria | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }
  try {
    const { data } = await axios.put<ICategoria>(
      `${API_URL}/private/categorias/${id}`,
      categoriaUpdated,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire({
      icon: "success",
      title: "Categoría actualizada",
      text: `Se actualizó la categoría \"${data.nombre}\" (ID ${id}).`,
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error(
      "❌ Error al actualizar categoría:",
      error.response?.data || error
    );
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo actualizar la categoría con ID ${id}.`,
    });
    return null;
  }
};

export const deleteCategoria = async (
  token: string | null,
  id: number
): Promise<boolean> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return false;
  }
  try {
    await axios.delete(`${API_URL}/private/categorias/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire({
      icon: "success",
      title: "Categoría eliminada",
      text: `Se eliminó la categoría con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } catch (error: any) {
    console.error("❌ Error al eliminar categoría:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo eliminar la categoría con ID ${id}.`,
    });
    return false;
  }
};