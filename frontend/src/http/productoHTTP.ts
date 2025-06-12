import axios from "axios";
import { IProducto } from "../types/IProducto";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9000/public/producto";

export const getAllProductos = async () => {
  try {
    const response: any = await axios.get<IProducto[]>(API_URL);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createProducto = async (
  token: string | null,
  nuevoProducto: IProducto
): Promise<IProducto | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }

  try {
    const { data } = await axios.post<IProducto>(
      `${API_URL} + "/public/productos"`,
      nuevoProducto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Producto creado",
      text: `Se creó correctamente el producto "${data.nombre}".`,
      timer: 2000,
      showConfirmButton: false,
    });

    console.log("✅ Producto creado:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error al crear producto:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo crear el producto "${nuevoProducto.nombre}".`,
    });
    return null;
  }
};

export const updateProducto = async (
  token: string | null,
  id: number,
  productoUpdated: Partial<IProducto>
): Promise<IProducto | null> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return null;
  }
  try {
    const { data } = await axios.put<IProducto>(
      `${API_URL}/private/productos/${id}`,
      productoUpdated,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire({
      icon: "success",
      title: "Producto actualizado",
      text: `Se actualizó el producto "${data.nombre}" (ID ${id}).`,
      timer: 2000,
      showConfirmButton: false,
    });
    return data;
  } catch (error: any) {
    console.error(
      "❌ Error al actualizar producto:",
      error.response?.data || error
    );
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo actualizar el producto con ID ${id}.`,
    });
    return null;
  }
};

export const deleteProducto = async (
  token: string | null,
  id: number
): Promise<boolean> => {
  if (!token) {
    console.error("Token ausente: no estás autenticado");
    return false;
  }
  try {
    await axios.delete(`${API_URL}/productos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire({
      icon: "success",
      title: "Producto eliminado",
      text: `Se eliminó el producto con ID ${id}.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } catch (error: any) {
    console.error("❌ Error al eliminar producto:", error.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `No se pudo eliminar el producto con ID ${id}.`,
    });
    return false;
  }
};