import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
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
  | "CartProduct"
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
  onEdited?: (newCantidad?: number) => void;
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
      <Card ref={cardRef} className={`mb-3 ${activo === false ? styles.softDeleted : ''} ${restored ? styles.restored : ''} ${variant === 'CartProduct' ? styles.cartProductFullWidth : ''} ${variant === 'Orders' ? styles.orderCardWidth : ''} ${(variant === 'Categories' || variant === 'Types' || variant === 'Sizes' || variant === 'Addresses') ? styles.adminNarrowCard : ''}`}>
        <Card.Body>
          {/* Vista especial para Client: disposición vertical */}
          {variant === "Client" && usuario ? (
            <UserProfileCard usuario={usuario} onEdited={onEdited} onDeleted={onDeleted} />
          ) : (
            variant === "CartProduct" ? (
              <Row className="align-items-center">
                <Col xs={3} className="text-center">
                  {imagenPublicId ? (
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
                  )}
                </Col>
                <Col xs={6}>
                  <h5 className="fw-bold mb-2">{name}</h5>
                  <div className="mb-2 text-secondary">{description}</div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {category && <span className="badge bg-dark text-white">Categoría: {category.nombre}</span>}
                    {type && <span className="badge bg-dark text-white">Tipo: {type.nombre}</span>}
                    {Array.isArray(sizes) && sizes.length > 0 && (
                      <span className="badge bg-dark text-white">
                        Talles: {sizes.map((s) => `${s.sistema} ${s.valor}`).join(", ")}
                      </span>
                    )}
                  </div>
                  <div className="mb-2"><b>Precio:</b> ${price}</div>
                  <div className="mb-2"><b>Cantidad:</b> {quantity}</div>
                </Col>
                <Col xs={3} className="d-flex flex-column align-items-center justify-content-center">
                  <button className="btn btn-danger w-100" onClick={onDeleted}>Quitar</button>
                </Col>
              </Row>
            ) : (
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
                    {variant === "Products" && producto && (
                      <Card.Body>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          {/* Imagen de miniatura eliminada */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>ID:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{id}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Name:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{name}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Description:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{description}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Color:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{color}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Category:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{category && typeof category === 'object' && typeof category.nombre === 'string' ? category.nombre : 'Sin categoría'}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Type:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{type && typeof type === 'object' && typeof type.nombre === 'string' ? type.nombre : 'Sin tipo'}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Sizes:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{Array.isArray(sizes) && sizes.length > 0 ? sizes.map((s) => (s && typeof s === 'object' && s.sistema && s.valor ? `${s.sistema} ${s.valor}` : null)).filter(Boolean).join(", ") : "Sin talles"}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Price:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>${price}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Cantidad:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{quantity}</div>
                            </div>
                            {/* Los botones originales debajo, no se agregan nuevos */}
                          </div>
                        </div>
                      </Card.Body>
                    )}

                    {variant === "Users" && usuario && (
                      <Card.Body>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600, minWidth: 90 }}>ID:</span>
                            <div style={{ flex: 1, minWidth: 0 }}>{usuario.id}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600, minWidth: 90 }}>Name:</span>
                            <div style={{ flex: 1, minWidth: 0 }}>{usuario.nombre}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600, minWidth: 90 }}>Email:</span>
                            <div style={{ flex: 1, minWidth: 0 }}>{usuario.email}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600, minWidth: 90 }}>Role:</span>
                            <div style={{ flex: 1, minWidth: 0 }}>{usuario.rol}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600, minWidth: 90 }}>Orders:</span>
                            <div style={{ flex: 1, minWidth: 0 }}>{usuario.ordenes && usuario.ordenes.length > 0 ? usuario.ordenes.length : "No posee"}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600, minWidth: 90 }}>Addresses:</span>
                            <div style={{ flex: 1, minWidth: 0 }}>{usuario.direcciones && usuario.direcciones.length > 0 ? usuario.direcciones.map((d, index) => (
                              <span key={d.id}>{index > 0 && "; "}{d.direccion.calle}, {d.direccion.localidad} ({d.direccion.cp})</span>
                            )) : "No posee"}</div>
                          </div>
                        </div>
                      </Card.Body>
                    )}

                    {variant === "Categories" && (
                      <Card.Body>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>ID:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{id}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Name:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{name}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Types:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{category?.tipos && category.tipos.length > 0 ? category.tipos.map((t) => t.nombre).join(", ") : "No posee"}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 110, alignItems: 'flex-end' }}>
                            <Button variant="primary" onClick={handleEditClick}>Editar</Button>
                            <DeleteButton view={variant} id={id} onDeleted={onDeleted} />
                          </div>
                        </div>
                      </Card.Body>
                    )}
                    {variant === "Types" && (
                      <Card.Body>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>ID:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{id}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Name:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{name}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Categories:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{categories && categories.length > 0 ? categories.map((c) => c.nombre).join(", ") : "No posee"}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 110, alignItems: 'flex-end' }}>
                            <Button variant="primary" onClick={handleEditClick}>Editar</Button>
                            <DeleteButton view={variant} id={id} onDeleted={onDeleted} />
                          </div>
                        </div>
                      </Card.Body>
                    )}
                    {variant === "Sizes" && (
                      <Card.Body>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>ID:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{id}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>System:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{system}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Value:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{value}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 110, alignItems: 'flex-end' }}>
                            <Button variant="primary" onClick={handleEditClick}>Editar</Button>
                            <DeleteButton view={variant} id={id} onDeleted={onDeleted} />
                          </div>
                        </div>
                      </Card.Body>
                    )}
                    {variant === "Addresses" && (
                      <Card.Body>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>ID:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{id}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>User:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{usuario?.nombre || usuarioDireccion?.usuario.nombre || "Sin usuario asignado"}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Street:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{street || usuarioDireccion?.direccion.calle}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Locality:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{locality || usuarioDireccion?.direccion.localidad}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, minWidth: 90 }}>Postal Code:</span>
                              <div style={{ flex: 1, minWidth: 0 }}>{pc || usuarioDireccion?.direccion.cp}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 110, alignItems: 'flex-end' }}>
                            <Button variant="primary" onClick={handleEditClick}>Editar</Button>
                            <DeleteButton view={variant} id={id} onDeleted={onDeleted} />
                          </div>
                        </div>
                      </Card.Body>
                    )}

                    {variant === "Orders" && (
                      <div style={{padding: '0.5rem 0'}}>
                        <div className="mb-2">
                          <span className="fw-bold">Dirección:</span> <span className="text-dark">{usuarioDireccion?.direccion.calle}, {usuarioDireccion?.direccion.localidad}</span>
                        </div>
                        <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
                          <span className="fw-bold">Productos:</span>
                          {detail?.map((d, idx) => (
                            <span key={idx} className="badge bg-dark text-white">{d.cantidad}× {d.producto?.nombre || 'Producto desconocido'}</span>
                          ))}
                        </div>
                        <div className="mb-2">
                          <span className="fw-bold">Fecha:</span> <span className="text-secondary">{formattedDate}</span>
                        </div>
                        <div className="mb-2">
                          <span className="fw-bold">Total:</span> <span className="text-success">${total}</span>
                        </div>
                        <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
                          <span className="fw-bold">Método de pago:</span>
                          <span className="badge bg-info text-dark">{payMethod}</span>
                        </div>
                        <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
                          <span className="fw-bold">Estado:</span>
                          <span className={`badge ${Dstatus === 'En_proceso' ? 'bg-warning text-dark' : Dstatus === 'Enviado' ? 'bg-primary' : Dstatus === 'Entregado' ? 'bg-success' : 'bg-secondary'}`}>{Dstatus === 'En_proceso' ? 'En proceso' : Dstatus === 'Enviado' ? 'Enviado' : Dstatus === 'Entregado' ? 'Entregado' : Dstatus}</span>
                        </div>
                      </div>
                    )}
                  </Col>

                  {/* Botones */}
                <Col xs={3} className="d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex flex-column gap-2 align-items-center w-100">
                    {activo !== false ? (
                      <>
                        {variant !== "Orders" && variant !== "Categories" && variant !== "Types" && variant !== "Sizes" && variant !== "Addresses" && (
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
                        )}
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
              )
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
