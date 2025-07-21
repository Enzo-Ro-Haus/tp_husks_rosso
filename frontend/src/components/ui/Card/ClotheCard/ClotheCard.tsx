import { useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import CloudinaryImg from "../../Image/CoudinaryImg";
import styles from "./ClotheCard.module.css";

type ClotheCardProps = {
  name: string;
  description?: string;
  price: number;
  imagenPublicId?: string;
  cantidad?: number;
  onDetailsClick?: () => void;
};

export const ClotheCard = ({ name, description, price, imagenPublicId, cantidad, onDetailsClick }: ClotheCardProps) => {
  return (
    <Card
      className={`shadow-sm border-0 ${styles.cardCustom}`}
      style={{ maxWidth: 320, width: '100%', cursor: 'pointer', borderRadius: 18, transition: 'box-shadow 0.2s, transform 0.2s' }}
      onClick={onDetailsClick}
    >
      <div className="position-relative">
        {imagenPublicId ? (
          <CloudinaryImg
            publicId={imagenPublicId}
            width={320}
            height={200}
            alt={name}
            className={`card-img-top ${styles.cardImgCustom}`}
            style={{ borderRadius: '18px 18px 0 0', objectFit: 'cover', height: 180, transition: 'transform 0.2s' }}
          />
        ) : (
          <Card.Img variant="top" src="src/assets/no_cloth.jpeg" style={{ borderRadius: '18px 18px 0 0', height: 180, objectFit: 'cover' }} />
        )}
        {cantidad === 0 && (
          <Badge bg="danger" className="position-absolute top-0 end-0 m-2">Sin stock</Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column align-items-center text-center p-3">
        <Card.Title className="mb-2 w-100" style={{ fontWeight: 700, fontSize: 22, color: '#231f20', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{name}</Card.Title>
        <Card.Text className="mb-2 w-100" style={{ color: '#5e5f5a', fontSize: 15, minHeight: 36, textOverflow: 'ellipsis', overflow: 'hidden' }}>{description}</Card.Text>
        <div className="mb-3 w-100 d-flex justify-content-center align-items-center">
          <span style={{ fontSize: 22, fontWeight: 700, color: '#231f20' }}>${price}</span>
        </div>
        <Button
          variant="primary"
          className="w-100 d-flex align-items-center justify-content-center mt-auto py-2 px-3 rounded-pill"
          style={{ fontWeight: 600, fontSize: 16 }}
          onClick={e => { e.stopPropagation(); onDetailsClick && onDetailsClick(); }}
        >
          Details
        </Button>
      </Card.Body>
    </Card>
  );
};
