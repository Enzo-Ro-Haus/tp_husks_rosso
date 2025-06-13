import axios from "axios";
import { ITalle } from "../types/ITalle";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const createTalle = async (
  token: string | null,
  nuevoTalle: ITalle
): Promise<ITalle | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }

  try {
    const { data } = await axios.post<ITalle>(
      `${API_URL}/talle`,
      nuevoTalle,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Talle creado",
      text: `Se creó correctamente el talle "${data.valor}" del sistema "${data.sistema}".`,
      timer: 2000,
      showConfirmButton: false,
    });

    console.log("✅ Talle creado:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error al crear Talle:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo crear el talle "${nuevoTalle.valor}".`,
    });
    return null;
  }
};

export const getAllTalles = async (token: string | null): Promise<ITalle[]> => {
  try {
    const response = await axios.get<ITalle[]>(`${API_URL}/public/talle`);
    console.log("✅ Talles recibidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener Talles:", error.response?.data || error);
    return [];
  }
};

export const updateTalle = async (
  token: string | null,
  id: number,
  talleUpdated: Partial<ITalle>
): Promise<ITalle | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }
  try {
    const { data } = await axios.put<ITalle>(
      `${API_URL}/talle/${id}`,
      talleUpdated,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire({
      icon: "success",
      title: "Talle actualizado",
      text: `Se actualizó el talle #${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error("❌ Error al actualizar talle:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo actualizar el talle con ID ${id}.`,
    });
    return null;
  }
};

export const deleteTalle = async (
  token: string | null,
  id: number
): Promise<boolean> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return false;
  }
  try {
    await axios.delete(`${API_URL}/talle/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire({
      icon: "success",
      title: "Talle eliminado",
      text: `Se eliminó el talle con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } catch (error: any) {
    console.error("❌ Error al eliminar talle:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo eliminar el talle con ID ${id}.`,
    });
    return false;
  }
};