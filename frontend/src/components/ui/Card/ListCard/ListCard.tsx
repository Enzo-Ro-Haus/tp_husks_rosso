import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { ICategoria } from "../../../../types/ICategoria";
import { IDetalle } from "../../../../types/IDetalle";
import { ITalle } from "../../../../types/ITalle";
import { ITipo } from "../../../../types/ITipo";
import { IUsuarioDireccion } from "../../../../types/IUsuarioDireccion";
import { IUsuario } from "../../../../types/IUsuario";
import { IProducto } from "../../../../types/IProducto";
import { EditButtonBootstrap } from "../../Buttons/EditButton/EditButtonBootstrap";
import { DeleteButton } from "../../Buttons/DeleteButton/DeleteButton";
import { RestoreButton } from "../../Buttons/RestoreButton/RestoreButton";
import UserProfileImage from "../../Image/UserProfileImage";
import styles from "./ListCard.module.css";

export type ListCardVariant =
  | "Products"
  | "Users"
  | "Categories"
  | "Types"
  | "Sizes"
  | "Addresses"
  | "Orders"
  | "Client";

export interface ListCardProps {
  variant: ListCardVariant;
  id: number | string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  color?: string;
  sizes?: ITalle[];
  category?: ICategoria;
  categories?: ICategoria[] | [];
  email?: string;
  rol?: string;
  imagenPerfilPublicId?: string;
  address?: IUsuarioDireccion[];
  type?: ITipo;
  system?: string;
  value?: string;
  street?: string;
  locality?: string;
  pc?: string;
  usuario?: IUsuario;
  usuarioDireccion?: IUsuarioDireccion;
  detail?: IDetalle[];
  date?: string;
  total?: number;
  payMethod?: string;
  Dstatus?: string;
  activo?: boolean;
  producto?: IProducto;
  onEdited?: () => void;
  onDeleted?: () => void;
  onRestored?: () => void;
}

export const ListCard: React.FC<ListCardProps> = (props) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  const {
    variant,
    id,
    name,
    description,
    price,
    quantity,
    color,
    sizes,
    category,
    categories,
    email,
    rol,
    imagenPerfilPublicId,
    address,
    type,
    system,
    value,
    street,
    locality,
    pc,
    usuario,
    usuarioDireccion,
    detail,
    date,
    total,
    payMethod,
    Dstatus,
    activo,
    producto,
    onEdited,
    onDeleted,
    onRestored,
  } = props;

  const [restored, setRestored] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail && e.detail.id === id && e.detail.view === variant) {
        setRestored(true);
        setTimeout(() => setRestored(false), 1500);
      }
    };
    window.addEventListener('restored-card', handler);
    return () => window.removeEventListener('restored-card', handler);
  }, [id, variant]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditUpdated = () => {
    setShowEditModal(false);
    if (onEdited) {
      onEdited();
    }
  };

  const getItemForEdit = () => {
    if (variant === "Products" && producto) return producto;
    if (variant === "Users" && usuario) return usuario;
    if (variant === "Client" && usuario) return usuario;
    if (variant === "Categories" && category) return category;
    if (variant === "Types" && type) return type;
    if (variant === "Sizes") return { sistema: system, valor: value, id };
    if (variant === "Addresses" && usuarioDireccion) return usuarioDireccion;
    if (variant === "Orders") return { usuario, usuarioDireccion, detalle: detail, fecha: date, total, metodoPago: payMethod, estado: Dstatus, id };
    return props;
  };

  // Debug temporal para talles
  if (variant === "Products" && sizes) {
    console.log("Talles en ListCard:", sizes);
  }

  const formattedDate = date ? new Date(date).toLocaleString() : "";

  return (
    <>
      <Card ref={cardRef} className={`mb-3 ${activo === false ? styles.softDeleted : ''} ${restored ? styles.restored : ''}`}>
        <Card.Body>
          <Row className="align-items-center">
            {/* Imagen y estado - solo para Users, Client y Products */}
            {(variant === "Users" || variant === "Client" || variant === "Products") && (
              <Col xs={3} className="text-center">
                {(variant === "Users" || variant === "Client") ? (
                  <UserProfileImage
                    imagenPerfilPublicId={imagenPerfilPublicId}
                    size="large"
                    alt={String(name)}
                    className="mb-2"
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                ) : (
                  <Card.Img
                    src="/src/assets/landings/image.png"
                    alt={String(name)}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                )}
                {activo != null && (
                  <Badge bg={activo ? "success" : "secondary"} className="mt-2">
                    {activo ? "Activo" : "Inactivo"}
                  </Badge>
                )}
                {restored && <span className={styles.restoredBadge}>Restaurado</span>}
              </Col>
            )}

            {/* Detalles según variante - ajustar el tamaño de la columna según si hay imagen o no */}
            <Col xs={variant === "Users" || variant === "Client" || variant === "Products" ? 6 : 9}>
              {variant === "Products" && (
                <>
                  <p>
                    <strong>ID:</strong> {id}
                  </p>
                  <p>
                    <strong>Name:</strong> {name}
                  </p>
                  <p>
                    <strong>Description:</strong> {description}
                  </p>
                  <p>
                    <strong>Color:</strong> {color}
                  </p>
                  <p>
                    <strong>Category:</strong> {category?.nombre}
                  </p>
                  <p>
                    <strong>Type:</strong> {type?.nombre || "Sin tipo"}
                  </p>
                  <p>
                    <strong>Sizes:</strong>{" "}
                    {sizes && sizes.length > 0 
                      ? sizes.map((s) => `${s.sistema} ${s.valor}`).join(", ")
                      : "No hay talles disponibles"
                    }
                  </p>
                  <p>
                    <strong>Price:</strong> ${price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {quantity}
                  </p>
                </>
              )}

              {(variant === "Users" || variant === "Client") && (
                <>
                  <p>
                    <strong>ID:</strong> {id}
                  </p>
                  <p>
                    <strong>Name:</strong> {name}
                  </p>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Role:</strong> {rol}
                  </p>
                  <p>
                    <strong>Orders:</strong>{" "}
                    {usuario?.ordenes && usuario.ordenes.length > 0 
                      ? usuario.ordenes.length 
                      : "No posee"
                    }
                  </p>
                  <p>
                    <strong>Addresses:</strong>{" "}
                    {address && address.length > 0 
                      ? address.map((d) => d.direccion.calle).join("; ")
                      : "No posee"
                    }
                  </p>
                </>
              )}

              {variant === "Categories" && (
                <>
                  <p>
                    <strong>ID:</strong> {id}
                  </p>
                  <p>
                    <strong>Name:</strong> {name}
                  </p>
                  <p>
                    <strong>Types:</strong>{" "}
                    {category?.tipos && category.tipos.length > 0
                      ? category.tipos.map((t) => t.nombre).join(", ")
                      : "No posee"
                    }
                  </p>
                  <p>
                    <strong>Products:</strong>{" "}
                    {category?.productos && category.productos.length > 0
                      ? category.productos.map((p) => p.nombre).join(", ")
                      : "No posee"
                    }
                  </p>
                </>
              )}

              {variant === "Types" && (
                <>
                  <p>
                    <strong>ID:</strong> {id}
                  </p>
                  <p>
                    <strong>Name:</strong> {name}
                  </p>
                  <p>
                    <strong>Categories:</strong>{" "}
                    {categories && categories.length > 0
                      ? categories.map((c) => c.nombre).join(", ")
                      : "No posee"
                    }
                  </p>
                  <p>
                    <strong>Products:</strong>{" "}
                    {categories && categories.length > 0 && categories
                      .flatMap((c) => c.productos ?? [])
                      .filter((p, i, arr) => p && arr.findIndex(pp => pp.id === p.id) === i)
                      .length > 0
                      ? categories
                          .flatMap((c) => c.productos ?? [])
                          .filter((p, i, arr) => p && arr.findIndex(pp => pp.id === p.id) === i)
                          .map((p) => p.nombre)
                          .join(", ")
                      : "No posee"
                    }
                  </p>
                </>
              )}

              {variant === "Sizes" && (
                <>
                  <p>
                    <strong>ID:</strong> {id}
                  </p>
                  <p>
                    <strong>System:</strong> {system}
                  </p>
                  <p>
                    <strong>Value:</strong> {value}
                  </p>
                  <p>
                    <strong>Products:</strong>{" "}
                    {sizes && sizes.length > 0
                      ? sizes
                          .flatMap((s) => s.productos || [])
                          .map((p) => p.nombre)
                          .join(", ")
                      : "No posee"
                    }
                  </p>
                </>
              )}

              {variant === "Addresses" && (
                <>
                  <p>
                    <strong>ID:</strong> {id}
                  </p>
                  <p>
                    <strong>User:</strong>{" "}
                    {usuario?.nombre || usuarioDireccion?.usuario.nombre || "Sin usuario asignado"}
                  </p>
                  <p>
                    <strong>Street:</strong>{" "}
                    {street || usuarioDireccion?.direccion.calle}
                  </p>
                  <p>
                    <strong>Locality:</strong>{" "}
                    {locality || usuarioDireccion?.direccion.localidad}
                  </p>
                  <p>
                    <strong>Postal Code:</strong>{" "}
                    {pc || usuarioDireccion?.direccion.cp}
                  </p>
                </>
              )}

              {variant === "Orders" && (
                <>
                  <p>
                    <strong>ID:</strong> {id}
                  </p>
                  <p>
                    <strong>User:</strong>{" "}
                    {usuario?.nombre || usuarioDireccion?.usuario.nombre}
                  </p>
                  <p>
                    <strong>Address:</strong> {usuarioDireccion?.direccion.calle},{" "}
                    {usuarioDireccion?.direccion.localidad}
                  </p>
                  <p>
                    <strong>Items:</strong>{" "}
                    {detail
                      ?.map((d) => `${d.cantidad}× ${d.producto.nombre}`)
                      .join(", ")}
                  </p>
                  <p>
                    <strong>Date:</strong> {formattedDate}
                  </p>
                  <p>
                    <strong>Total:</strong> ${total}
                  </p>
                  <p>
                    <strong>Payment:</strong> {payMethod}
                  </p>
                  <p>
                    <strong>Status:</strong> {Dstatus}
                  </p>
                </>
              )}
            </Col>

            {/* Botones */}
            <Col xs={3} className="text-center">
              <Row className="g-2 justify-content-center">
                {activo !== false ? (
                  <>
                    <Col xs="auto">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleEditClick}
                      >
                        Editar
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <DeleteButton view={variant} id={id} onDeleted={onDeleted} />
                    </Col>
                  </>
                ) : (
                  <Col xs="auto">
                    <RestoreButton
                      view={variant}
                      id={typeof id === 'string' ? parseInt(id) : id}
                      onRestored={onRestored}
                    />
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Modal de edición */}
      {showEditModal && (
        <EditButtonBootstrap
          view={variant}
          item={getItemForEdit()}
          onClose={handleEditClose}
          onUpdated={handleEditUpdated}
        />
      )}
    </>
  );
};
