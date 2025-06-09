import axios from "axios";
import { ICategoria } from "../types/ICategoria";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";


export const crearCategoria = async (
  nuevaCategoria: ICategoria
): Promise<void> => {
  try {
    const response = await axios.post<ICategoria>(
      `${API_URL}/auth/register`,
      nuevaCategoria
    );  
    console.log(response);
    Swal.fire({
      icon: "success",
      title: "Categoria creada",
      text: "El registro se realizó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error: any) {
    console.error("Error al crear categoria:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo crear la categoria",
    });
  }
};

export const getAllCategorias = async (token: string | null): Promise<ICategoria[]> => {
  try {
    const response = await axios.get<ICategoria[]>(`${API_URL}/husks/v1/categoria`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Categotrías recibidas:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener categorias:", error.response?.data || error);
    return []; 
  }
};
