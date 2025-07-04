import React, { useState } from 'react';
import { usuarioStore } from '../../../../store/usuarioStore';
import Swal from 'sweetalert2';
import * as productAPI from '../../../../http/productoHTTP';
import * as userAPI from '../../../../http/usuarioHTTP';
import * as categoryAPI from '../../../../http/categoriaHTTP';
import * as typeAPI from '../../../../http/tipoHTTP';
import * as sizeAPI from '../../../../http/talleHTTP';
import * as addressAPI from '../../../../http/direccionHTTP';
import * as orderAPI from '../../../../http/ordenHTTPS';
import styles from './RestoreButton.module.css';

type ViewType = 'Users' | 'Products' | 'Categories' | 'Types' | 'Sizes' | 'Addresses' | 'Orders' | 'Client';

interface RestoreButtonProps {
  view: ViewType;
  id: number;
  onRestored?: () => void;
}

const restoreHandlers: Record<ViewType, (token: string, id: number) => Promise<boolean>> = {
  Users: async (token, id) => {
    try {
      await userAPI.restoreUsuario(token, id);
      return true;
    } catch (error) {
      return false;
    }
  },
  Products: async (token, id) => {
    try {
      await productAPI.restoreProducto(token, id);
      return true;
    } catch (error) {
      return false;
    }
  },
  Categories: async (token, id) => {
    try {
      await categoryAPI.restoreCategoria(token, id);
      return true;
    } catch (error) {
      return false;
    }
  },
  Types: async (token, id) => {
    try {
      await typeAPI.restoreTipo(token, id);
      return true;
    } catch (error) {
      return false;
    }
  },
  Sizes: async (token, id) => {
    try {
      await sizeAPI.restoreTalle(token, id);
      return true;
    } catch (error) {
      return false;
    }
  },
  Addresses: async (token, id) => {
    try {
      await addressAPI.restoreUsuarioDireccion(token, id);
      return true;
    } catch (error) {
      return false;
    }
  },
  Orders: async (token, id) => {
    try {
      await orderAPI.restoreOrden(token, id);
      return true;
    } catch (error) {
      return false;
    }
  },
  Client: async (token, id) => {
    try {
      await userAPI.restoreUsuario(token, id);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export const RestoreButton: React.FC<RestoreButtonProps> = ({ view, id, onRestored }) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token);
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    if (!token) return;

    const result = await Swal.fire({
      title: '¿Restaurar elemento?',
      text: `¿Estás seguro de que quieres restaurar este ${view.toLowerCase()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const handler = restoreHandlers[view];
        const success = await handler(token, id);
        setLoading(false);
        if (success) {
          onRestored?.();
          // Emitir evento para animación visual
          const event = new CustomEvent('restored-card', { detail: { id, view } });
          window.dispatchEvent(event);
          // Mostrar badge visual
          Swal.fire({
            icon: 'success',
            title: '¡Restaurado!',
            text: 'El elemento fue restaurado correctamente.',
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => window.location.reload(), 1200);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo restaurar el elemento.'
          });
        }
      } catch (error) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error inesperado al restaurar.'
        });
      }
    }
  };

  return (
    <button 
      className={styles.restoreButton}
      onClick={handleRestore}
      disabled={loading}
    >
      {loading && <span className={styles.spinner}></span>}
      Restaurar
    </button>
  );
}; 