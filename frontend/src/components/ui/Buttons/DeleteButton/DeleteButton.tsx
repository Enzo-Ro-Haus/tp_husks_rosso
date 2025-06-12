import React, { useState } from 'react';
import style from './DeleteButton.module.css';
import { usuarioStore } from '../../../../store/usuarioStore';

// HTTP services
import * as userAPI from '../../../../http/usuarioHTTP';
import * as productAPI from '../../../../http/productoHTTP';
import * as categoryAPI from '../../../../http/categoriaHTTP';
import * as typeAPI from '../../../../http/tipoHTTP';
import * as sizeAPI from '../../../../http/talleHTTP';
import * as addressAPI from '../../../../http/direccionHTTP';
import * as orderAPI from '../../../../http/ordenHTTPS';

type ViewType =
  | 'Users'
  | 'Products'
  | 'Categories'
  | 'Types'
  | 'Sizes'
  | 'Addresses'
  | 'Orders'
  | 'Client';

interface DeleteButtonProps {
  view: ViewType;
  id: number | string;
  onDeleted?: () => void;
}

// Map de handlers de borrado por vista
const deleteHandlers: Record<
  ViewType,
  (token: string, id: number | string) => Promise<boolean>
> = {
  Users: async (token, id) => !!(await userAPI.deleteUsuario(token, Number(id))),
  Products: async (token, id) => !!(await productAPI.deleteProducto(token, Number(id))),
  Categories: async (token, id) => !!(await categoryAPI.deleteCategoria(token, Number(id))),
  Types: async (token, id) => !!(await typeAPI.deleteTipo(token, Number(id))),
  Sizes: async (token, id) => !!(await sizeAPI.deleteTalle(token, Number(id))),
  Addresses: async (token, id) => !!(await addressAPI.deleteDireccion(token, Number(id))),
  Orders: async (token, id) => !!(await orderAPI.deleteOrden(token, Number(id))),
  Client: async (token, id) => !!(await userAPI.deleteUsuario(token, Number(id))),
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({ view, id, onDeleted }) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token) || '';
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    if (!token) return;
    const handler = deleteHandlers[view];
    const success = handler ? await handler(token, id) : false;
    if (success && onDeleted) onDeleted();
    handleClose();
  };

  return (
    <>
      <button className={style.deleteButton} onClick={handleOpen}>
        Delete
      </button>

      {open && (
        <div className={style.popup}>
          <div className={style.popupContent}>
            <h2>¿Eliminar {view} #{id}?</h2>
            <div className={style.containerButtonsPopUp}>
              <button
                onClick={handleDelete}
                className={style.buttonSend}
              >
                Confirmar
              </button>
              <button
                onClick={handleClose}
                className={style.buttonClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};