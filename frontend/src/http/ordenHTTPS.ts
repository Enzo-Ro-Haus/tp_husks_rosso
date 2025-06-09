import axios from "axios";
import { IOrden } from "../types/IOrden";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";


export const crearOrden = async (
  nuevaOrden: IOrden
): Promise<void> => {
  try {
    const response = await axios.post<IOrden>(
      `${API_URL}/auth/register`,
      nuevaOrden
    );  
    console.log(response);
    Swal.fire({
      icon: "success",
      title: "Orden creada",
      text: "El registro se realizó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error: any) {
    console.error("Error al crear Orden:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo crear la Orden",
    });
  }
};

export const getAllOrdenes = async (token: string | null): Promise<IOrden[]> => {
  try {
    const response = await axios.get<IOrden[]>(`${API_URL}/husks/v1/orden-compra`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Ordenes recibidas:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener Ordenes:", error.response?.data || error);
    return []; 
  }
};
