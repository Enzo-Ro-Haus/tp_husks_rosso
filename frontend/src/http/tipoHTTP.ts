import axios from "axios";
import { ITipo } from "../types/ITipo";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const createTipo = async (
  token: string | null, // Add token param
  nuevoTipo: ITipo
): Promise<ITipo | null> => {
  if (!token) {
    console.error("Missing token");
    return null;
  }

  try {
    const { data } = await axios.post<ITipo>(
      `${API_URL}/tipo`,
      nuevoTipo,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add auth header
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Tipo creado",
      text: "La creación se realizó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error("❌ Error al obtener tipos:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo registrar el tipo",
    });
    return null;
  }
};

export const getAllTipos = async (token: string | null): Promise<ITipo[]> => {
  try {
    const response = await axios.get<ITipo[]>(`${API_URL}/public/tipo`);
    console.log("✅ Tipos recibidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener tipos:", error.response?.data || error);
    return [];
  }
};

export const updateTipo = async (
  id: number,
  tipoUpdated: Partial<ITipo>
): Promise<ITipo | null> => {
  try {
    const { data } = await axios.put<ITipo>(
      `${API_URL}/tipo/${id}`,
      tipoUpdated
    );
    Swal.fire({
      icon: "success",
      title: "Tipo actualizado",
      text: `Se actualizó el tipo con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error(
      "❌ Error al actualizar tipo:",
      error.response?.data || error
    );
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo actualizar el tipo con ID ${id}.`,
    });
    return null;
  }
};

export const deleteTipo = async (
  token: string | null,
  id: number
): Promise<boolean> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return false;
  }
  try {
    await axios.delete(`${API_URL}/tipo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire({
      icon: "success",
      title: "Tipo eliminado",
      text: `Se eliminó el tipo con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } catch (error: any) {
    console.error("❌ Error al eliminar tipo:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo eliminar el tipo con ID ${id}.`,
    });
    return false;
  }
};
