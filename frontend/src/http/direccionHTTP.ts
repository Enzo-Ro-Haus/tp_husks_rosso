import axios from "axios";
import { IDireccion } from "../types/IDireccion";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const createDireccion = async (
  token: string | null,
  nuevaDireccion: IDireccion
): Promise<IDireccion | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }

  try {
    const { data } = await axios.post<IDireccion>(
      `${API_URL}/direccion`,
      nuevaDireccion,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Dirección creada",
      text: `Se creó correctamente la dirección en ${data.calle}, ${data.localidad}.`,
      timer: 2000,
      showConfirmButton: false,
    });

    console.log("✅ Dirección creada:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error al crear dirección:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo crear la dirección en ${nuevaDireccion.calle}.`,
    });
    return null;
  }
};

export const getAllDireccions = async (
  token: string | null
): Promise<IDireccion[]> => {
  try {
    const response = await axios.get<IDireccion[]>(
      `${API_URL}/direccion`,
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

export const updateDireccion = async (
  token: string | null,
  id: number,
  direccionUpdated: Partial<IDireccion>
): Promise<IDireccion | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }
  try {
    const { data } = await axios.put<IDireccion>(
      `${API_URL}/direccion/${id}`,
      direccionUpdated,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire({
      icon: "success",
      title: "Dirección actualizada",
      text: `Se actualizó la dirección ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error(
      "❌ Error al actualizar dirección:",
      error.response?.data || error
    );
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo actualizar la dirección con ID ${id}.`,
    });
    return null;
  }
};

export const deleteDireccion = async (
  token: string | null,
  id: number
): Promise<boolean> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return false;
  }
  try {
    await axios.delete(`${API_URL}/private/direccion/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire({
      icon: "success",
      title: "Dirección eliminada",
      text: `Se eliminó la dirección con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } catch (error: any) {
    console.error("❌ Error al eliminar dirección:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo eliminar la dirección con ID ${id}.`,
    });
    return false;
  }
};