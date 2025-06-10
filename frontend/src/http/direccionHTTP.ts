import axios from "axios";
import { IDireccion } from "../types/IDireccion";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const crearDireccion = async (
  nuevaDireccion: IDireccion
): Promise<void> => {
  try {
    const response = await axios.post<IDireccion>(
      `${API_URL}/public/register`,
      nuevaDireccion
    );
    console.log(response);
    Swal.fire({
      icon: "success",
      title: "Direccion creada",
      text: "El registro se realizó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    console.error("Error al crear Direccion:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo crear la Direccion",
    });
  }
};

export const getAllDireccions = async (
  token: string | null
): Promise<IDireccion[]> => {
  try {
    const response = await axios.get<IDireccion[]>(
      `${API_URL}/husks/v1/direccion`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Direcciones recibidas:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener Direcciones:",
      error.response?.data || error
    );
    return [];
  }
};
