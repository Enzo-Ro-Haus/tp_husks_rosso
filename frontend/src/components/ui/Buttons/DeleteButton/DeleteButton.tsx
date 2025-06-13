import React from "react";
import style from "./DeleteButton.module.css";
import { usuarioStore } from "../../../../store/usuarioStore";

// HTTP services
import * as userAPI from "../../../../http/usuarioHTTP";
import * as productAPI from "../../../../http/productoHTTP";
import * as categoryAPI from "../../../../http/categoriaHTTP";
import * as typeAPI from "../../../../http/tipoHTTP";
import * as sizeAPI from "../../../../http/talleHTTP";
import * as addressAPI from "../../../../http/direccionHTTP";
import * as orderAPI from "../../../../http/ordenHTTPS";
import Swal from "sweetalert2";

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
  (token: string, id: number | string) => Promise<boolean>
> = {
  Users: async (token, id) =>
    !!(await userAPI.deleteUsuario(token, Number(id))),
  Products: async (token, id) =>
    !!(await productAPI.deleteProducto(token, Number(id))),
  Categories: async (token, id) =>
    !!(await categoryAPI.deleteCategoria(token, Number(id))),
  Types: async (token, id) => !!(await typeAPI.deleteTipo(token, Number(id))),
  Sizes: async (token, id) => !!(await sizeAPI.deleteTalle(token, Number(id))),
  Addresses: async (token, id) =>
    !!(await addressAPI.deleteDireccion(token, Number(id))),
  Orders: async (token, id) =>
    !!(await orderAPI.deleteOrden(token, Number(id))),
  Client: async (token, id) =>
    !!(await userAPI.deleteUsuario(token, Number(id))),
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  view,
  id,
  onDeleted,
}) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token) || "";

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `¿Deseas eliminar ${view} ID:${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const handler = deleteHandlers[view];
      const success = handler ? await handler(token, id) : false;

      if (success) {
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: `${view} ID:${id} fue eliminado correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });

        if (onDeleted) {
          onDeleted();
          window.location.reload();
        }

      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `No se pudo eliminar ${view} ID:${id}.`,
        });
      }
    }
  };

  return (
    <button className={style.deleteButton} onClick={handleDelete}>
      Delete
    </button>
  );
};