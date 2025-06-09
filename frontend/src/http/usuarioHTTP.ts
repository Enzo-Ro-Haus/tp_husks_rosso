import axios from "axios";
import { IUsuario } from "../types/IUsuario";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";


export const registrarUsuario = async (
  nuevoUsuario: IUsuario
): Promise<string | null> => {
  try {
    const response = await axios.post<IUsuario>(
      `${API_URL}/auth/register`,
      nuevoUsuario
    );

    Swal.fire({
      icon: "success",
      title: "Usuario creado",
      text: "El registro se realizó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data.token ?? null;

  } catch (error: any) {
    console.error("Error al registrar usuario:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo registrar el usuario",
    });
    return null;
  }
};

export const getAllUsuarios = async (token: string | null): Promise<IUsuario[]> => {
  try {
    const response = await axios.get<IUsuario[]>(
      `${API_URL}/husks/v1/usuario`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Usuarios recibidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error.response?.data || error);
    return []; 
  }
};
