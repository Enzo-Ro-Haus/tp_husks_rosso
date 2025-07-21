import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { IUsuario } from '../../../types/IUsuario';
import { EditButtonBootstrap } from '../Buttons/EditButton/EditButtonBootstrap';
import Swal from 'sweetalert2';
import { usuarioStore } from '../../../store/usuarioStore';
import * as userAPI from '../../../http/usuarioHTTP';
import { softDeleteUsuario } from '../../../http/usuarioHTTP';

interface UserProfileCardProps {
  usuario: IUsuario;
  onEdited?: () => void;
  onDeleted?: () => void;
}

const headerGray = '#e9ecef';

const UserProfileCard: React.FC<UserProfileCardProps> = ({ usuario, onEdited, onDeleted }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const token = usuarioStore((s) => s.usuarioActivo?.token) || "";

  const handleEditClick = () => setShowEditModal(true);
  const handleEditClose = () => setShowEditModal(false);
  const handleEditUpdated = () => {
    setShowEditModal(false);
    if (onEdited) onEdited();
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `¿Deseas eliminar tu usuario?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await softDeleteUsuario(token, usuario.id ?? 0);
        await Swal.fire({
          icon: "success",
          title: "Borrado lógico",
          text: `Tu usuario fue dado de baja correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
        if (onDeleted) onDeleted();
      } catch (error: any) {
        let errorMessage = "Error inesperado al eliminar el usuario.";
        if (error.code === 'ERR_NETWORK') {
          errorMessage = "Error de conexión. Verifica que el backend esté ejecutándose.";
        } else if (error.response?.status === 404) {
          errorMessage = "El usuario no fue encontrado.";
        } else if (error.response?.status === 403) {
          errorMessage = "No tienes permisos para eliminar este usuario.";
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
    <div className="d-flex flex-column align-items-center p-4" style={{ background: '#fff', borderRadius: 12, maxWidth: 400, minWidth: 280, margin: '0 auto' }}>
      <img
        src={usuario.imagenPerfilPublicId ? `/src/assets/${usuario.imagenPerfilPublicId}.jpg` : "/src/assets/user_img.jpg"}
        alt={usuario.nombre}
        style={{ width: 200, height: 200, borderRadius: 20, objectFit: "cover", border: `3px solid ${headerGray}` }}
      />
      <h3 className="mb-2 mt-3 text-center">{usuario.nombre}</h3>
      <p className="mb-3 text-center" style={{ fontSize: "1.1rem" }}>{usuario.email}</p>
      <div className="d-flex flex-column gap-2 mt-2 w-100 align-items-center">
        <Button variant="primary" className="w-75" onClick={handleEditClick}>Editar mi perfil</Button>
        <Button variant="danger" className="w-75" onClick={handleDelete}>Eliminar</Button>
      </div>
      {showEditModal && (
        <EditButtonBootstrap
          view="Client"
          item={usuario}
          onClose={handleEditClose}
          onUpdated={handleEditUpdated}
        />
      )}
    </div>
  );
};

export default UserProfileCard; 