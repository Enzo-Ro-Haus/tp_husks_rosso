import axios from "axios";
import { IOrden } from "../types/IOrden";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const getAllOrdenes = async (
  token: string | null
): Promise<IOrden[]> => {
  try {
    console.log("=== DEBUG getAllOrdenes ===");
    console.log("Token:", token ? "Present" : "Missing");
    console.log("URL:", `${API_URL}/orden-compra`);
    
    const response = await axios.get<IOrden[]>(`${API_URL}/orden-compra`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    console.log("Response data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
    
    return response.data;
  } catch (error: any) {
    console.error("=== DEBUG getAllOrdenes ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    return [];
  }
};

export const getOrdenById = async (
  token: string | null,
  id: number
): Promise<IOrden> => {
  const { data } = await axios.get<IOrden>(`${API_URL}/orden-compra/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createOrden = async (
  token: string | null,
  nuevaOrden: IOrden
): Promise<IOrden> => {
  // Limpiar el objeto antes de enviarlo
  const ordenLimpia = {
    ...nuevaOrden,
    usuario: nuevaOrden.usuario && typeof nuevaOrden.usuario === 'object' ? { id: (nuevaOrden.usuario as any).id } : nuevaOrden.usuario,
    usuarioDireccion: nuevaOrden.usuarioDireccion && typeof nuevaOrden.usuarioDireccion === 'object' ? { id: (nuevaOrden.usuarioDireccion as any).id } : nuevaOrden.usuarioDireccion,
    detalles: (nuevaOrden.detalles || []).map((detalle: any) => ({
      producto: detalle.producto && typeof detalle.producto === 'object' ? { id: detalle.producto.id } : detalle.producto,
      cantidad: detalle.cantidad
    }))
  };

  const { data } = await axios.post<IOrden>(
    `${API_URL}/orden-compra`,
    ordenLimpia,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  Swal.fire({
    icon: "success",
    title: "Orden creada",
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const updateOrden = async (
  token: string | null,
  id: number,
  ordenUpdated: Partial<IOrden>
): Promise<IOrden> => {
  // Limpiar el objeto antes de enviarlo
  const ordenLimpia = {
    ...ordenUpdated,
    usuario: ordenUpdated.usuario && typeof ordenUpdated.usuario === 'object' ? { id: (ordenUpdated.usuario as any).id } : ordenUpdated.usuario,
    usuarioDireccion: ordenUpdated.usuarioDireccion && typeof ordenUpdated.usuarioDireccion === 'object' ? { id: (ordenUpdated.usuarioDireccion as any).id } : ordenUpdated.usuarioDireccion,
    detalles: (ordenUpdated.detalles || []).map((detalle: any) => ({
      producto: detalle.producto && typeof detalle.producto === 'object' ? { id: detalle.producto.id } : detalle.producto,
      cantidad: detalle.cantidad
    }))
  };

  console.log('Payload original:', JSON.stringify(ordenUpdated, null, 2)); // Debug
  console.log('Payload limpio:', JSON.stringify(ordenLimpia, null, 2)); // Debug

  const { data } = await axios.put<IOrden>(
    `${API_URL}/orden-compra/${id}`,
    ordenLimpia,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  Swal.fire({ icon: 'success', title: 'Orden actualizada', timer: 2000, showConfirmButton: false });
  return data;
};

export const deleteOrden = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.delete(`${API_URL}/orden-compra/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Orden eliminada",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const softDeleteOrden = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/orden-compra/soft-delete/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Orden dada de baja (soft delete)",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const restoreOrden = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/orden-compra/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Orden restaurada",
    text: `Orden ID ${id} restaurada exitosamente.`,
    timer: 2000,
    showConfirmButton: false,
  });
};
