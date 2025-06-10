import axios from "axios";
import { ITipo } from "../types/ITipo";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const crearTipo = async (nuevaTipo: ITipo): Promise<void> => {
  try {
    const response = await axios.post<ITipo>(
      `${API_URL}/auth/register`,
      nuevaTipo
    );
    console.log(response);
    Swal.fire({
      icon: "success",
      title: "Tipo creado",
      text: "El registro se realizó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    console.error("Error al crear Tipo:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo crear la Tipo",
    });
  }
};

export const getAllTipos = async (token: string | null): Promise<ITipo[]> => {
  try {
    const response = await axios.get<ITipo[]>(`${API_URL}/husks/v1/tipo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Tipos recibidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener tipos:", error.response?.data || error);
    return [];
  }
};
