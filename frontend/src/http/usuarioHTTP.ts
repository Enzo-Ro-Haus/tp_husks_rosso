import axios from "axios";
import { IAuthResponse, IUsuario } from "../types/IUsuario";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const registrarUsuario = async (
  nuevoUsuario: IUsuario
): Promise<IAuthResponse | null> => {
  try {
    const { data } = await axios.post<IAuthResponse>(
      `${API_URL}/public/register`,
      nuevoUsuario
    );

    console.log("✅ Registro correcto:", data);

    Swal.fire({
      icon: "success",
      title: "Usuario creado",
      text: "El registro se realizó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    return data; // devuelve { token, usuario }
  } catch (error: any) {
    console.error("Error al registrar usuario:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo registrar el usuario",
    });
    return null;
  }
};

export const loginUsuario = async (
  email: string,
  password: string
): Promise<IAuthResponse | null> => {
  try {
    const { data } = await axios.post<IAuthResponse>(
      `${API_URL}/public/login`,
      {
        email,
        password,
      }
    );
     Swal.fire({
      icon: 'success',
      title: 'Login',
      text: `Welcome ${data.usuario.name}!`,
      timer: 2000,
      showConfirmButton: false,
    });
    return data; // { token, usuario }
  } catch (error: any) {
    console.error("Error al iniciar sesión", error.response?.data || error);
    return null;
  }
};

export const getAllUsuarios = async (
  token: string | null
): Promise<IUsuario[]> => {
  try {
    const response = await axios.get<IUsuario[]>(`${API_URL}/public/usuario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Usuarios recibidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener usuarios:",
      error.response?.data || error
    );
    return [];
  }
};
