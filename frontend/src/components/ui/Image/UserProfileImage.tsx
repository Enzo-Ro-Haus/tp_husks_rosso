import CloudinaryImg from './CoudinaryImg';
import userImg from '../../../assets/user_img.jpg';

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
        src={userImg}
        alt={alt}
        width={width}
        height={height}
        className={className || ''}
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
      className={className || ''}
      style={style}
    />
  );
};

export default UserProfileImage; 