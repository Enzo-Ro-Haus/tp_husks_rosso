import axios from "axios";
import { ITalle } from "../types/ITalle";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";


export const crearTalle = async (
  nuevaTalle: ITalle
): Promise<void> => {
  try {
    const response = await axios.post<ITalle>(
      `${API_URL}/auth/register`,
      nuevaTalle
    );  
    console.log(response);
    Swal.fire({
      icon: "success",
      title: "Talle creado",
      text: "El registro se realizó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error: any) {
    console.error("Error al crear Talle:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo crear el Talle",
    });
  }
};

export const getAllTalles = async (token: string | null): Promise<ITalle[]> => {
  try {
    const response = await axios.get<ITalle[]>(`${API_URL}/husks/v1/talle`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Talles recibidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener Talles:", error.response?.data || error);
    return []; 
  }
};
