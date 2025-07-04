import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import CloudinaryImg from './CoudinaryImg';
import style from './ImageUpload.module.css';

interface ImageUploadProps {
  currentImagePublicId?: string;
  onImageUpload: (file: File) => Promise<string>;
  onImageRemove?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImagePublicId,
  onImageUpload,
  onImageRemove,
  label = "Imagen",
  className = "",
  disabled = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const publicId = await onImageUpload(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const displayImage = currentImagePublicId;

  return (
    <div className={`${style.imageUploadContainer} ${className}`}>
      <label className={style.label}>
        <b>{label}</b>
      </label>
      {displayImage && (
        <div className={style.currentImageContainer}>
          <CloudinaryImg
            publicId={displayImage}
            width={200}
            height={150}
            alt={label}
            className={style.currentImage}
          />
          {!disabled && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleRemove}
              className={style.removeButton}
            >
              Eliminar
            </Button>
          )}
        </div>
      )}
      {previewUrl && !displayImage && (
        <div className={style.previewContainer}>
          <img
            src={previewUrl}
            alt="Preview"
            className={style.previewImage}
          />
          <div className={style.previewActions}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Subir Imagen'}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      {/* Área de carga visible si no hay imagen ni preview */}
      {!displayImage && !previewUrl && (
        <div
          className={`${style.uploadArea} ${dragActive ? style.dragActive : ""}`}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{ cursor: "pointer" }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={style.fileInput}
            disabled={disabled}
            id={`image-upload-${label.toLowerCase().replace(/\s+/g, '-')}`}
            style={{ display: "none" }}
          />
          <div className={style.uploadContent}>
            <i className="bi bi-cloud-upload"></i>
            <span>
              {dragActive
                ? "Suelta la imagen aquí"
                : "Haz click o arrastra una imagen aquí"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 