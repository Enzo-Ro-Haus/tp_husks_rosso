import axios from "axios";

// Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = 'drro36ctw';
const CLOUDINARY_UPLOAD_PRESET = 'Husks_ecommerce'; // Tu preset real

// Función para subir imagen directamente a Cloudinary
export const uploadImageToCloudinary = async (file: File, folder?: string): Promise<string> => {
  // 1) Preparar FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  // Opcional: agregar carpeta de destino
  if (folder) {
    formData.append("folder", folder);
  }

  // 2) Endpoint de subida
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  console.log('Subiendo a Cloudinary:', {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    fileName: file.name,
    fileSize: file.size,
    url: url
  });

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    console.log('Respuesta exitosa de Cloudinary:', response.data);
    
    // 3) Devuelvo el public_id para guardarlo en tu formulario/DB
    return response.data.public_id as string;
  } catch (error: any) {
    console.error("Error subiendo a Cloudinary:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Mostrar error más específico
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData?.error?.message) {
        throw new Error(`Error de Cloudinary: ${errorData.error.message}`);
      } else if (errorData?.message) {
        throw new Error(`Error de Cloudinary: ${errorData.message}`);
      }
    }
    
    throw new Error("No se pudo subir la imagen a Cloudinary.");
  }
};

// Función para eliminar imagen de Cloudinary (opcional)
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        public_id: publicId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      console.warn('Error al eliminar imagen de Cloudinary:', publicId);
    }
  } catch (error) {
    console.warn('Error al eliminar imagen de Cloudinary:', error);
  }
}; 