import axios from "axios";
import { ITalle } from "../types/ITalle";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const getAllTalles = async (
  token: string | null
): Promise<ITalle[]> => {
  try {
    console.log("=== DEBUG getAllTalles ===");
    console.log("Token:", token ? "Present" : "Missing");
    console.log("URL:", `${API_URL}/talle`);
    
    const response = await axios.get<ITalle[]>(`${API_URL}/talle`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    console.log("Response data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
    
    return response.data;
  } catch (error: any) {
    console.error("=== DEBUG getAllTalles ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    return [];
  }
};

export const createTalle = async (
  token: string | null,
  nuevoTalle: ITalle
): Promise<ITalle> => {
  const { data } = await axios.post<ITalle>(`${API_URL}/talle`, nuevoTalle, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Talle creado",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const updateTalle = async (
  token: string | null,
  id: number,
  talleUpdated: Partial<ITalle>
): Promise<ITalle> => {
  const { data } = await axios.put<ITalle>(
    `${API_URL}/talle/${id}`,
    talleUpdated,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  Swal.fire({
    icon: "success",
    title: "Talle actualizado",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const deleteTalle = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.delete(`${API_URL}/talle/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Talle eliminado",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const softDeleteTalle = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/talle/soft-delete/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const restoreTalle = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/talle/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
