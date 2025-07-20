import { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import CloudinaryImg from "../../Image/CoudinaryImg";

type ClotheCardProps = {
  name: string;
  description?: string;
  price: number;
  imagenPublicId?: string;
};

export const ClotheCard = ({ name, description, price, imagenPublicId }: ClotheCardProps) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card style={{ width: "18rem" }}>
        {imagenPublicId ? (
          <CloudinaryImg 
            publicId={imagenPublicId} 
            width={288} 
            height={200} 
            alt={name}
            className="card-img-top"
          />
        ) : (
          <Card.Img variant="top" src="src/assets/no_cloth.jpeg" />
        )}
        <Card.Body className="d-flex flex-column align-items-start text-start">
          <Card.Title className="mb-3 w-100">
            <b>Name:</b> {name}
          </Card.Title>

          <Card.Text className="mb-2 w-100 ps-0">
            <div className="d-flex align-items-baseline w-100">
              <strong className="me-1">Description:</strong>
              <span>{description}</span>
            </div>
          </Card.Text>

          <Card.Text className="mb-3 w-100 ps-0">
            <div className="d-flex justify-content-end align-items-baseline w-100">
              <strong className="me-1">$</strong>
              <span>{price}</span>
            </div>
          </Card.Text>

          <Button
            variant="primary"
            className="align-self-start"
            onClick={handleShow}
          >
            Details
          </Button>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {imagenPublicId && (
            <div className="text-center mb-3">
              <CloudinaryImg 
                publicId={imagenPublicId} 
                width={300} 
                height={250} 
                alt={name}
              />
            </div>
          )}
          <p>
            <strong>Descripción:</strong> {description}
          </p>
          <p>
            <strong>Precio:</strong> ${price}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
            }}
          >
            Comprar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
