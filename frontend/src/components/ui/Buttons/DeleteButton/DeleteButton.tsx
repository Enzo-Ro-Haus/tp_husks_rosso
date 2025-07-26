import React from "react";
import { Button } from "react-bootstrap";
import style from "./DeleteButton.module.css";
import { usuarioStore } from "../../../../store/usuarioStore";
import { direccionStore } from "../../../../store/direccionStore";

// HTTP services
import * as userAPI from "../../../../http/usuarioHTTP";
import * as productAPI from "../../../../http/productoHTTP";
import * as categoryAPI from "../../../../http/categoriaHTTP";
import * as typeAPI from "../../../../http/tipoHTTP";
import * as sizeAPI from "../../../../http/talleHTTP";
import * as addressAPI from "../../../../http/direccionHTTP";
import * as orderAPI from "../../../../http/ordenHTTPS";
import Swal from "sweetalert2";

// Importo los métodos softDelete
import {
  softDeleteUsuario
} from "../../../../http/usuarioHTTP";
import {
  softDeleteProducto
} from "../../../../http/productoHTTP";
import {
  softDeleteCategoria
} from "../../../../http/categoriaHTTP";
import {
  softDeleteTipo
} from "../../../../http/tipoHTTP";
import {
  softDeleteTalle
} from "../../../../http/talleHTTP";
import {
  softDeleteUsuarioDireccion
} from "../../../../http/direccionHTTP";
import {
  softDeleteOrden
} from "../../../../http/ordenHTTPS";

type ViewType =
  | "Users"
  | "Products"
  | "Categories"
  | "Types"
  | "Sizes"
  | "Addresses"
  | "Orders"
  | "Client";

interface DeleteButtonProps {
  view: ViewType;
  id: number | string;
  onDeleted?: () => void;
}

// Handlers por tipo de entidad
const deleteHandlers: Record<
  ViewType,
  (token: string, id: number | string) => Promise<void>
> = {
  Users: async (token, id) => await userAPI.deleteUsuario(token, Number(id)),
  Products: async (token, id) => await productAPI.deleteProducto(token, Number(id)),
  Categories: async (token, id) => await categoryAPI.deleteCategoria(token, Number(id)),
  Types: async (token, id) => await typeAPI.deleteTipo(token, Number(id)),
  Sizes: async (token, id) => await sizeAPI.deleteTalle(token, Number(id)),
  Addresses: async (token, id) => await addressAPI.deleteUsuarioDireccion(token, Number(id)),
  Orders: async (token, id) => await orderAPI.deleteOrden(token, Number(id)),
  Client: async (token, id) => await userAPI.deleteUsuario(token, Number(id)),
};

const softDeleteHandlers: Record<
  ViewType,
  (token: string, id: number | string) => Promise<boolean>
> = {
  Users: async (token, id) => {
    await softDeleteUsuario(token, Number(id));
    return true;
  },
  Products: async (token, id) => {
    await softDeleteProducto(token, Number(id));
    return true;
  },
  Categories: async (token, id) => {
    await softDeleteCategoria(token, Number(id));
    return true;
  },
  Types: async (token, id) => {
    await softDeleteTipo(token, Number(id));
    return true;
  },
  Sizes: async (token, id) => {
    await softDeleteTalle(token, Number(id));
    return true;
  },
  Addresses: async (token, id) => {
    await softDeleteUsuarioDireccion(token, Number(id));
    return true;
  },
  Orders: async (token, id) => {
    await softDeleteOrden(token, Number(id));
    return true;
  },
  Client: async (token, id) => {
    await softDeleteUsuario(token, Number(id));
    return true;
  },
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  view,
  id,
  onDeleted,
}) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token) || "";
  const logout = usuarioStore((s) => s.logOut);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `¿Deseas eliminar ${view} ID:${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Permanently delet",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      showDenyButton: true,
      denyButtonText: "soft delete",
    });

    if (result.isConfirmed || result.isDenied) {
      try {
        const handler = result.isDenied ? softDeleteHandlers[view] : deleteHandlers[view];
        await handler(token, id);
        await Swal.fire({
          icon: "success",
          title: result.isDenied ? "Borrado lógico" : "Eliminado",
          text: `${view} ID:${id} is ${result.isDenied ? "Deactivated (soft delete)" : "Deleted"} successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        if (onDeleted) {
          onDeleted();
        }
        // Si es el propio usuario en Client y fue soft delete, desloguear
        if (view === "Client" && result.isDenied) {
          logout();
        }
        // Actualizar stores específicos según el tipo de entidad
        if (view === "Addresses") {
          // Actualizar el store de direcciones con todas las direcciones (incluyendo soft delete)
          const direccionesActualizadas = await addressAPI.getAllUsuarioDirecciones(token);
          direccionStore.getState().setArrayDirecciones(direccionesActualizadas);
        }
      } catch (error: any) {
        console.error("Error al eliminar:", error);
        let errorMessage = "Error inesperado al eliminar el elemento.";
        
        if (error.code === 'ERR_NETWORK') {
          errorMessage = "Error de conexión. Verifica que el backend esté ejecutándose en el puerto 9000.";
        } else if (error.response?.status === 404) {
          errorMessage = "El elemento no fue encontrado.";
        } else if (error.response?.status === 403) {
          errorMessage = "No tienes permisos para eliminar este elemento.";
        } else if (error.response?.status === 500) {
          errorMessage = "Error interno del servidor.";
        }
        
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    }
  };

  return (
    <Button variant="danger" className="w-100" onClick={handleDelete}>
      Delete
    </Button>
  );
};