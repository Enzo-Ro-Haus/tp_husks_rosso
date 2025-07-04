import axios from "axios";
import { IProducto } from "../types/IProducto";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000";

export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log("=== DEBUG: Testing backend connection ===");
    const response = await axios.get(`${API_URL}/producto/ping`);
    console.log("Test response:", response.data);
    return true;
  } catch (error: any) {
    console.error("=== DEBUG: Backend connection test failed ===");
    console.error("Error:", error);
    return false;
  }
};

export const testProductoData = async (): Promise<any> => {
  try {
    console.log("=== DEBUG: Testing producto data endpoint ===");
    const response = await axios.get(`${API_URL}/producto/test-data`);
    console.log("Test data response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("=== DEBUG: Producto data test failed ===");
    console.error("Error:", error);
    return null;
  }
};

export const getAllProductos = async (
  token: string | null
): Promise<IProducto[]> => {
  try {
    console.log("=== DEBUG getAllProductos ===");
    console.log("Token:", token ? "Present" : "Missing");
    console.log("URL:", `${API_URL}/producto`);
    
    const response = await axios.get<IProducto[]>(`${API_URL}/producto`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    console.log("Response data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
    
    return response.data;
  } catch (error: any) {
    console.error("=== DEBUG getAllProductos ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    return [];
  }
};

export const getAllProductosWithTalles = async (
  token: string | null
): Promise<IProducto[]> => {
  const response = await axios.get<IProducto[]>(`${API_URL}/producto/with-talles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createProducto = async (
  token: string | null,
  nuevoProducto: IProducto
): Promise<IProducto> => {
  const { data } = await axios.post<IProducto>(
    `${API_URL}/producto`,
    nuevoProducto,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  Swal.fire({
    icon: "success",
    title: "Producto creado",
    text: `"${data.nombre}" creado.`,
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const updateProducto = async (
  token: string | null,
  id: number,
  productoUpdated: Partial<IProducto>
): Promise<IProducto> => {
  const { data } = await axios.put<IProducto>(
    `${API_URL}/producto/${id}`,
    productoUpdated,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  Swal.fire({
    icon: "success",
    title: "Producto actualizado",
    text: `ID ${id} actualizado.`,
    timer: 2000,
    showConfirmButton: false,
  });
  return data;
};

export const deleteProducto = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.delete(`${API_URL}/producto/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Producto eliminado",
    text: `ID ${id} eliminado.`,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const softDeleteProducto = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/producto/soft-delete/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Producto dado de baja (soft delete)",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const restoreProducto = async (
  token: string | null,
  id: number
): Promise<void> => {
  await axios.patch(`${API_URL}/producto/restore/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  Swal.fire({
    icon: "success",
    title: "Producto restaurado",
    text: `Producto ID ${id} restaurado exitosamente.`,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const getPublicProductos = async (): Promise<IProducto[]> => {
  try {
    console.log("=== DEBUG getPublicProductos ===");
    console.log("URL:", `${API_URL}/producto/public`);
    
    const response = await axios.get<IProducto[]>(`${API_URL}/producto/public`);
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    console.log("Response data length:", Array.isArray(response.data) ? response.data.length : "Not an array");
    
    return response.data;
  } catch (error: any) {
    console.error("=== DEBUG getPublicProductos ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    return [];
  }
};
