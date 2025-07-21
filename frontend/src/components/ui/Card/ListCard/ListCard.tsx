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
import CloudinaryImg from "../../Image/CoudinaryImg";
import styles from "./ListCard.module.css";
import UserProfileCard from '../../UserProfileCard/UserProfileCard';

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
  imagenPublicId?: string;
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
    imagenPublicId,
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
          {/* Vista especial para Client: disposición vertical */}
          {variant === "Client" && usuario ? (
            <UserProfileCard usuario={usuario} onEdited={onEdited} onDeleted={onDeleted} />
          ) : (
            // ... existing code ...
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
                  ) : variant === "Products" ? (
                    imagenPublicId ? (
                      <CloudinaryImg
                        publicId={imagenPublicId}
                        width={200}
                        height={150}
                        alt={String(name)}
                        style={{ width: "100%", borderRadius: 8 }}
                      />
                    ) : (
                      <Card.Img
                        src="/src/assets/no_cloth.jpeg"
                        alt={String(name)}
                        style={{ width: "100%", borderRadius: 8 }}
                      />
                    )
                  ) : null}
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
                {variant === "Client" && usuario && (
                  <div className="clientCard d-flex flex-column align-items-center justify-content-start w-100 h-100" style={{borderRadius: 0, boxShadow: 'none', minHeight: '100vh', minWidth: '100vw', padding: 0, margin: 0}}>
                    <img
                      src={usuario.imagenPerfilPublicId ? `/src/assets/${usuario.imagenPerfilPublicId}.jpg` : "/src/assets/user_img.jpg"}
                      alt={usuario.nombre}
                      style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover", border: "3px solid #0d6efd", marginTop: '2rem' }}
                    />
                    <h3 className="mt-4 mb-2 text-center">{usuario.nombre}</h3>
                    <p className="mb-4 text-center" style={{ fontSize: "1.1rem" }}>{usuario.email}</p>
                    <div className="w-100 d-flex flex-column align-items-center">
                      <h5 className="text-center mb-3">Direcciones</h5>
                      {usuario.direcciones && usuario.direcciones.filter((d: any) => d.activo !== false).length > 0 ? (
                        <ul className="list-group mb-3" style={{maxWidth: 400, width: '100%'}}>
                          {usuario.direcciones.filter((d: any) => d.activo !== false).map((d: any) => (
                            <li key={d.id} className="list-group-item text-center">
                              {d.direccion.calle}, {d.direccion.localidad} ({d.direccion.cp})
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <div className="d-flex flex-column gap-3 mt-4 w-100 align-items-center">
                      <button className="btn btn-primary w-50" onClick={onEdited}>Editar mi perfil</button>
                      <button className="btn btn-danger w-50" onClick={onDeleted}>Eliminar mi perfil</button>
                    </div>
                  </div>
                )}
                    {variant === "Products" && (
                      <>
                        <p>
                          <strong>ID:</strong> {id}
                        </p>
                        <p>
                          <strong>Name:</strong> <span className={activo === false ? styles.softDeletedName : ''}>{name}</span>
                        </p>
                        <p>
                          <strong>Description:</strong> {description}
                        </p>
                        <p>
                          <strong>Color:</strong> {color}
                        </p>
                        <p>
                          <strong>Category:</strong> {category && typeof category === 'object' && typeof category.nombre === 'string' ? category.nombre : 'Sin categoría'}
                        </p>
                        <p>
                          <strong>Type:</strong> {type && typeof type === 'object' && typeof type.nombre === 'string' ? type.nombre : 'Sin tipo'}
                        </p>
                        <p>
                          <strong>Sizes:</strong>{" "}
                          {Array.isArray(sizes) && sizes.length > 0
                            ? sizes.map((s) => (s && typeof s === 'object' && s.sistema && s.valor ? `${s.sistema} ${s.valor}` : null)).filter(Boolean).join(", ")
                            : "Sin talles"}
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
                          <strong>Name:</strong> <span className={activo === false ? styles.softDeletedName : ''}>{name}</span>
                        </p>
                        <p>
                          <strong>Email:</strong> {email}
                        </p>
                        {/* Eliminar Role, Orders y Addresses para Client */}
                        {variant === "Users" && (
                          <>
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
                                ? address.map((d, index) => (
                                    <span key={d.id}>
                                      {index > 0 && "; "}
                                      {d.direccion.calle}, {d.direccion.localidad} ({d.direccion.cp})
                                    </span>
                                  ))
                                : "No posee"
                              }
                            </p>
                          </>
                        )}
                      </>
                    )}

                    {variant === "Categories" && (
                      <>
                        <p>
                          <strong>ID:</strong> {id}
                        </p>
                        <p>
                          <strong>Name:</strong> <span className={activo === false ? styles.softDeletedName : ''}>{name}</span>
                        </p>
                        <p>
                          <strong>Types:</strong>{" "}
                          {category?.tipos && category.tipos.length > 0
                            ? category.tipos.map((t) => t.nombre).join(", ")
                            : "No posee"
                          }
                        </p>
                        {/* Eliminada la sección de productos */}
                      </>
                    )}

                    {variant === "Types" && (
                      <>
                        <p>
                          <strong>ID:</strong> {id}
                        </p>
                        <p>
                          <strong>Name:</strong> <span className={activo === false ? styles.softDeletedName : ''}>{name}</span>
                        </p>
                        <p>
                          <strong>Categories:</strong>{" "}
                          {categories && categories.length > 0
                            ? categories.map((c) => c.nombre).join(", ")
                            : "No posee"
                          }
                        </p>
                        {/* Eliminada la sección de productos para Types */}
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
                            ?.map((d) => {
                              if (d && d.producto && typeof d.producto.nombre === 'string') {
                                return `${d.cantidad}× ${d.producto.nombre}`;
                              } else {
                                return `${d.cantidad}× Producto desconocido`;
                              }
                            })
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
                <Col xs={3} className="d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex flex-column gap-2 align-items-center w-100">
                    {activo !== false ? (
                      <>
                        <Button
                          variant="primary"
                          className="w-75"
                          onClick={handleEditClick}
                        >
                          Editar
                        </Button>
                        <div className="w-75">
                          <DeleteButton view={variant} id={id} onDeleted={onDeleted} />
                        </div>
                      </>
                    ) : (
                      <div className="w-75">
                        <RestoreButton
                          view={variant}
                          id={typeof id === 'string' ? parseInt(id) : id}
                          onRestored={onRestored}
                        />
                      </div>
                    )}
                  </div>
                </Col>
                </Row>
              )}
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
