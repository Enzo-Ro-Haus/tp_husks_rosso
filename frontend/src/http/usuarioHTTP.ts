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
      icon: "success",
      title: "Login",
      text: `Welcome ${data.usuario.nombre}!`,
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
    const response = await axios.get<IUsuario[]>(`${API_URL}/usuario`, {
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

export const getMiUsuario = async (
  token: string | null
): Promise<IUsuario | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }

  try {
    const { data } = await axios.get<IUsuario>(`${API_URL}/usuario/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Mi usuario:", data);
    return data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener mi usuario:",
      error.response?.data || error
    );
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        "No pudimos obtener tu información de usuario",
    });
    return null;
  }
};

export const deleteUsuario = async (
  token: string | null,
  id: number
): Promise<boolean> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return false;
  }

  try {
    await axios.delete(`${API_URL}/usuario/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Swal.fire({
      icon: "success",
      title: "Usuario eliminado",
      text: `Se eliminó correctamente el usuario con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });

    return true;
  } catch (error: any) {
    console.error(
      "❌ Error al eliminar usuario:",
      error.response?.data || error
    );
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo eliminar el usuario con ID ${id}.`,
    });
    return false;
  }
};

export const updateUsuario = async (
  token: string | null,
  id: number,
  usuarioUpdated: Partial<IUsuario>
): Promise<IUsuario | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }

  try {
    const { data } = await axios.put<IUsuario>(
      `${API_URL}/usuario/${id}`,
      usuarioUpdated,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Usuario actualizado",
      text: `Se actualizaron los datos del usuario con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });

    return data;
  } catch (error: any) {
    console.error(
      "❌ Error al actualizar usuario:",
      error.response?.data || error
    );
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo actualizar el usuario con ID ${id}.`,
    });
    return null;
  }
};
