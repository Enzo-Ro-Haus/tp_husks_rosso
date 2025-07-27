import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { IUsuario } from '../../../types/IUsuario';
import { EditButtonBootstrap } from '../Buttons/EditButton/EditButtonBootstrap';
import { usuarioStore } from '../../../store/usuarioStore';
import { softDeleteMeUsuario } from '../../../http/usuarioHTTP';
import CloudinaryImg from '../../ui/Image/CoudinaryImg';

interface UserProfileCardProps {
  usuario: IUsuario;
  onEdited?: () => void;
  onDeleted?: () => void;
}

const headerGray = '#e9ecef';

const UserProfileCard: React.FC<UserProfileCardProps> = ({ usuario, onEdited, onDeleted }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const token = usuarioStore((s) => s.usuarioActivo?.token) || '';
  const logout = usuarioStore((s) => s.logOut);
  const navigate = useNavigate();
  const setUsuarioActivo = usuarioStore((s) => s.setUsuarioActivo);

  // Check if user has a custom image
  const publicId = usuario.imagenPerfilPublicId?.trim();
  const hasCustomImage = Boolean(publicId && publicId !== 'user_img');

  const handleEditClick = () => setShowEditModal(true);
  const handleEditClose = () => setShowEditModal(false);

  const handleEditUpdated = () => {
    setShowEditModal(false);
    onEdited?.();
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Deseas eliminar tu usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    try {
      await softDeleteMeUsuario(token);
      await Swal.fire({ icon: 'success', title: 'Borrado lógico', text: 'Tu usuario fue dado de baja correctamente.', timer: 2000, showConfirmButton: false });
      onDeleted?.();
      await Swal.fire({ icon: 'success', title: 'Sesión cerrada', text: `¡Hasta luego, ${usuario.nombre}!`, timer: 2000, showConfirmButton: false });
      setUsuarioActivo(null);
      logout();
      navigate('/');
      setTimeout(() => { window.location.href = '/'; }, 100);
    } catch (error: any) {
      let errorMessage = 'Error inesperado al eliminar el usuario.';
      if (error.code === 'ERR_NETWORK') errorMessage = 'Error de conexión. Verifica que el backend esté ejecutándose.';
      else if (error.response?.status === 404) errorMessage = 'El usuario no fue encontrado.';
      else if (error.response?.status === 403) errorMessage = 'No tienes permisos para eliminar este usuario.';
      else if (error.response?.status === 500) errorMessage = 'Error interno del servidor.';

      Swal.fire({ icon: 'error', title: 'Error', text: errorMessage });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center p-4" style={{ background: '#fff', borderRadius: 12, maxWidth: 400, minWidth: 280, margin: '0 auto' }}>
      <div style={{ width: 200, height: 200, borderRadius: 20, overflow: 'hidden', border: `3px solid ${headerGray}` }}>
        {hasCustomImage ? (
          <CloudinaryImg
            publicId={publicId!}
            width={200}
            height={200}
            alt={usuario.nombre}
            className="img-fluid"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <img
            src="/assets/user_img.jpg"
            alt={usuario.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <h3 className="mb-2 mt-3 text-center">{usuario.nombre}</h3>
      <p className="mb-3 text-center" style={{ fontSize: '1.1rem' }}>{usuario.email}</p>

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
