import CloudinaryImg from './CoudinaryImg';

interface UserProfileImageProps {
  imagenPerfilPublicId?: string;
  size?: 'small' | 'medium' | 'large';
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const UserProfileImage = ({ 
  imagenPerfilPublicId, 
  size = 'medium', 
  alt = "Imagen de perfil",
  className,
  style
}: UserProfileImageProps) => {
  console.log("UserProfileImage recibió imagenPerfilPublicId:", imagenPerfilPublicId);
  
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40 };
      case 'large':
        return { width: 150, height: 150 };
      default:
        return { width: 80, height: 80 };
    }
  };

  const { width, height } = getSize();

  // Si no hay imagenPerfilPublicId o está vacío, usar imagen por defecto
  if (!imagenPerfilPublicId || imagenPerfilPublicId.trim() === "" || imagenPerfilPublicId === "user_img") {
    console.log("No hay imagenPerfilPublicId válido, usando imagen por defecto");
    return (
      <img
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='35' r='20' fill='%23ccc'/%3E%3Cpath d='M20 80 Q50 60 80 80' fill='%23ccc'/%3E%3C/svg%3E"
        alt={alt}
        width={width}
        height={height}
        className={`rounded-circle ${className || ''}`}
        style={{ objectFit: 'cover', ...style }}
      />
    );
  }

  console.log("Usando CloudinaryImg con publicId:", imagenPerfilPublicId);
  return (
    <CloudinaryImg
      publicId={imagenPerfilPublicId}
      width={width}
      height={height}
      alt={alt}
      className={`rounded-circle ${className || ''}`}
      style={style}
    />
  );
};

export default UserProfileImage; 