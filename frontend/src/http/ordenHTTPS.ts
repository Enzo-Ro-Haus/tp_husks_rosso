import axios from "axios";
import { IOrden } from "../types/IOrden";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const createOrden = async (
  token: string | null,
  nuevaOrden: IOrden
): Promise<IOrden | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }

  try {
    const { data } = await axios.post<IOrden>(
     `${API_URL}/orden-compra`,
      nuevaOrden,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Orden creada",
      text: `Se creó correctamente la orden #${data.id}.`,
      timer: 2000,
      showConfirmButton: false,
    });

    console.log("✅ Orden creada:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error al crear orden:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo crear la orden.`,
    });
    return null;
  }
};

export const getAllOrdenes = async (
  token: string | null
): Promise<IOrden[]> => {
  try {
    const response = await axios.get<IOrden[]>(
      `${API_URL}/orden-compra`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Ordenes recibidas:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener Ordenes:",
      error.response?.data || error
    );
    return [];
  }
};

export const updateOrden = async (
  token: string | null,
  id: number,
  ordenUpdated: Partial<IOrden>
): Promise<IOrden | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }
  try {
    const { data } = await axios.put<IOrden>(
      `${API_URL}/orden-compra/${id}`,
      ordenUpdated,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire({
      icon: "success",
      title: "Orden actualizada",
      text: `Se actualizó la orden #${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error(
      "❌ Error al actualizar orden:",
      error.response?.data || error
    );
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo actualizar la orden con ID ${id}.`,
    });
    return null;
  }
};

export const deleteOrden = async (
  token: string | null,
  id: number
): Promise<boolean> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return false;
  }
  try {
    await axios.delete(`${API_URL}/orden-compra/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire({
      icon: "success",
      title: "Orden eliminada",
      text: `Se eliminó la orden con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } catch (error: any) {
    console.error("❌ Error al eliminar orden:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo eliminar la orden con ID ${id}.`,
    });
    return false;
  }
};