import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { useState } from "react";

interface CloudinaryImgProps {
  publicId: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CloudinaryImg = ({ 
  publicId, 
  width = 500, 
  height = 500, 
  alt = "Imagen", 
  className,
  style
}: CloudinaryImgProps) => {
  const cld = new Cloudinary({cloud: {cloudName: 'drro36ctw'} });
  const [error, setError] = useState(false);
  
  const img = cld
    .image(publicId)
    .format('auto') 
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(width).height(height));

  if (error) {
    return (
      <img
        src={"/src/assets/no_cloth.jpeg"}
        alt={alt}
        className={className}
        style={style}
      />
    );
  }

  return (
    <AdvancedImage 
      cldImg={img} 
      alt={alt}
      className={className}
      style={style}
      onError={() => setError(true)}
    />
  );
};

export default CloudinaryImg;