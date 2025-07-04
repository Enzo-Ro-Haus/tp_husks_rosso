import { IProducto } from '../types/IProducto';
import { IUsuario } from '../types/IUsuario';

const API_URL = 'http://localhost:8080/api';

// Función para subir imagen a Cloudinary y obtener el public ID
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Nota: Esta función asume que tienes un endpoint en el backend para manejar la subida
  // o que manejas la subida directamente desde el frontend usando la API de Cloudinary
  const response = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Error al subir la imagen');
  }
  
  const data = await response.json();
  return data.publicId;
};

// Función para actualizar la imagen de un producto
export const updateProductImage = async (productId: number, publicId: string): Promise<IProducto> => {
  const response = await fetch(`${API_URL}/productos/${productId}/imagen`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ imagenPublicId: publicId }),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar la imagen del producto');
  }
  
  return response.json();
};

// Función para actualizar la imagen de perfil de un usuario
export const updateUserProfileImage = async (userId: number, publicId: string): Promise<IUsuario> => {
  const response = await fetch(`${API_URL}/usuarios/${userId}/imagen-perfil`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ imagenPerfilPublicId: publicId }),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar la imagen de perfil');
  }
  
  return response.json();
}; 