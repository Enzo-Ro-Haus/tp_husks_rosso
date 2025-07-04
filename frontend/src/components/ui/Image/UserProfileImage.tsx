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

  if (!imagenPerfilPublicId) {
    // Imagen por defecto cuando no hay public ID
    return (
      <img
        src="src/assets/user_img.jpg"
        alt={alt}
        width={width}
        height={height}
        className={`rounded-circle ${className || ''}`}
        style={{ objectFit: 'cover', ...style }}
      />
    );
  }

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