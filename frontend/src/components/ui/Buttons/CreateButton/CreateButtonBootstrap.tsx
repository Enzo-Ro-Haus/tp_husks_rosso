import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal, Button, Form as BootstrapForm, Row, Col, Alert, Badge } from "react-bootstrap";
import { usuarioStore } from "../../../../store/usuarioStore";
import Swal from "sweetalert2";

import * as userAPI from "../../../../http/usuarioHTTP";
import * as productAPI from "../../../../http/productoHTTP";
import * as categoryAPI from "../../../../http/categoriaHTTP";
import * as typeAPI from "../../../../http/tipoHTTP";
import * as sizeAPI from "../../../../http/talleHTTP";
import * as addressAPI from "../../../../http/direccionHTTP";
import * as orderAPI from "../../../../http/ordenHTTPS";
import { uploadImageToCloudinary } from "../../../../http/cloudinaryUploadHTTP";
import ImageUpload from "../../Image/ImageUpload";

import { ICategoria } from "../../../../types/ICategoria";
import { ITipo } from "../../../../types/ITipo";
import { IUsuario } from "../../../../types/IUsuario";
import { IDireccion } from "../../../../types/IDireccion";
import { IUsuarioDireccion } from "../../../../types/IUsuarioDireccion";
import { IProducto } from "../../../../types/IProducto";
import { Rol } from '../../../../types/enums/Rol';
import { SistemaTalle } from '../../../../types/enums/SistemaTalle';
import { MetodoPago } from '../../../../types/enums/MetodoPago';
import { EstadoOrden } from '../../../../types/enums/EstadoOrden';
import { tipoStore } from "../../../../store/tipoStore";
import { categoriaStore } from "../../../../store/categoriaStore";

type ViewType =
  | "Users"
  | "Products"
  | "Categories"
  | "Types"
  | "Sizes"
  | "Addresses"
  | "Orders";

interface Props {
  view: ViewType;
  onClose: () => void;
  onCreated?: () => void;
}

// Valores iniciales simplificados por vista
const initialValuesMap: Record<ViewType, any> = {
  Users: { nombre: "", email: "", password: "", imagenPerfilPublicId: "" },
  Products: {
    nombre: "",
    cantidad: 1,
    precio: 0.01,
    color: "",
    talles: [],
    categoria: { id: 0 },
    tipo: { id: 0 },
    descripcion: "",
    imagenPublicId: "",
  },
  Categories: { nombre: "", tipos: [] },
  Types: { nombre: "", categorias: [] },
  Sizes: { sistema: "", valor: "" },
  Addresses: { 
    usuario: { id: 0 }, 
    direccion: { id: 0 },
    crearNuevaDireccion: false,
    calle: "",
    localidad: "",
    cp: ""
  },
  Orders: {
    usuario: null,
    usuarioDireccion: null,
    detalle: [],
    fecha: new Date().toISOString().slice(0, 10),
    total: 0,
    metodoPago: "",
    estado: "",
    crearNuevoUsuario: false,
    nuevoUsuarioNombre: "",
    nuevoUsuarioEmail: "",
    nuevoUsuarioPassword: "",
    crearNuevaDireccion: false,
    nuevaDireccionCalle: "",
    nuevaDireccionLocalidad: "",
    nuevaDireccionCP: "",
    productoSeleccionado: "",
    cantidadProducto: 1,
  },
};

// Validaciones Yup
const schemaMap: Record<ViewType, yup.ObjectSchema<any>> = {
  Users: yup.object({
    nombre: yup.string().required("❌ Obligatorio"),
    email: yup.string().email().required("❌ Obligatorio"),
    password: yup.string().min(6).required("❌ Obligatorio"),
    imagenPerfilPublicId: yup.string().optional(),
  }),
  Products: yup.object({
    nombre: yup.string().required(),
    cantidad: yup.number().min(1).required(),
    precio: yup.number().min(0.01).required(),
    color: yup.string().required(),
    talles: yup.array().of(yup.number()).min(1).required(),
    categoria: yup.object({ id: yup.number().required() }).required(),
    tipo: yup.object({ id: yup.number().required() }).required(),
    descripcion: yup.string().required(),
    imagenPublicId: yup.string().optional(),
  }),
  Categories: yup.object({
    nombre: yup.string().required(),
    tipos: yup.array().of(yup.number()).min(0),
  }),
  Types: yup.object({
    nombre: yup.string().required(),
    categorias: yup.array().of(
      yup.object({ id: yup.number().required(), nombre: yup.string().required() })
    ).min(1),
  }),
  Sizes: yup.object({
    sistema: yup.string().required(),
    valor: yup.string().required(),
  }),
  Addresses: yup.object({
    usuario: yup.object({ id: yup.number().required() }).required(),
    direccion: yup.object({ id: yup.number().required() }).when('crearNuevaDireccion', {
      is: false,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    crearNuevaDireccion: yup.boolean(),
    calle: yup.string().when('crearNuevaDireccion', {
      is: true,
      then: (schema) => schema.required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
    localidad: yup.string().when('crearNuevaDireccion', {
      is: true,
      then: (schema) => schema.required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
    cp: yup.string().when('crearNuevaDireccion', {
      is: true,
      then: (schema) => schema.required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  Orders: yup.object({
    usuario: yup.object({ id: yup.number().required() }).nullable().required("Debe seleccionar un usuario"),
    usuarioDireccion: yup.object({ id: yup.number().required() }).nullable().required("Debe seleccionar una dirección"),
    detalle: yup
      .array()
      .of(
        yup.object({
          producto: yup.object({ id: yup.number().required() }).required(),
          cantidad: yup.number().min(1).required(),
        })
      )
      .min(1, "Debe agregar al menos un producto"),
    fecha: yup.string().required(),
    total: yup.number().min(0).required(),
    metodoPago: yup.string().required(),
    estado: yup.string().required(),
    crearNuevoUsuario: yup.boolean(),
    nuevoUsuarioNombre: yup.string().when(['crearNuevoUsuario'], {
      is: true,
      then: (schema) => schema.required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
    nuevoUsuarioEmail: yup.string().when(['crearNuevoUsuario'], {
      is: true,
      then: (schema) => schema.email().required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
    nuevoUsuarioPassword: yup.string().when(['crearNuevoUsuario'], {
      is: true,
      then: (schema) => schema.min(6).required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
    crearNuevaDireccion: yup.boolean(),
    nuevaDireccionCalle: yup.string().when(['crearNuevaDireccion'], {
      is: true,
      then: (schema) => schema.required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
    nuevaDireccionLocalidad: yup.string().when(['crearNuevaDireccion'], {
      is: true,
      then: (schema) => schema.required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
    nuevaDireccionCP: yup.string().when(['crearNuevaDireccion'], {
      is: true,
      then: (schema) => schema.required("❌ Obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
};

// Handlers para crear elementos
const createHandlers: Record<ViewType, (token: string, payload: any) => Promise<boolean>> = {
  Users: async (token, payload) => {
    try {
      const result = await userAPI.registrarUsuario(payload);
      return !!result;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  },
  Products: async (token, payload) => {
    try {
      const result = await productAPI.createProducto(token, payload);
      return !!result;
    } catch (error) {
      console.error('Error creating product:', error);
      return false;
    }
  },
  Categories: async (token, payload) => {
    try {
      const result = await categoryAPI.createCategoria(token, payload);
      return !!result;
    } catch (error) {
      console.error('Error creating category:', error);
      return false;
    }
  },
  Types: async (token, payload) => {
    try {
      const result = await typeAPI.createTipo(token, payload);
      return !!result;
    } catch (error) {
      console.error('Error creating type:', error);
      return false;
    }
  },
  Sizes: async (token, payload) => {
    try {
      const result = await sizeAPI.createTalle(token, payload);
      return !!result;
    } catch (error) {
      console.error('Error creating size:', error);
      return false;
    }
  },
  Addresses: async (token, payload) => {
    try {
      const result = await addressAPI.createUsuarioDireccion(token, payload);
      return !!result;
    } catch (error) {
      console.error('Error creating address:', error);
      return false;
    }
  },
  Orders: async (token, payload) => {
    try {
      const result = await orderAPI.createOrden(token, payload);
      return !!result;
    } catch (error) {
      console.error('Error creating order:', error);
      return false;
    }
  },
};

const DEFAULT_IMAGE_PUBLIC_ID = "user_img";

export const CreateButtonBootstrap: React.FC<Props> = ({ view, onClose, onCreated }) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token)!;

  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [direcciones, setDirecciones] = useState<IUsuarioDireccion[]>([]);
  const [talles, setTalles] = useState<any[]>([]);
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [crearNuevaDireccion, setCrearNuevaDireccion] = useState(false);
  const [crearNuevaCategoria, setCrearNuevaCategoria] = useState(false);
  const [crearNuevoTalle, setCrearNuevoTalle] = useState(false);
  const [crearNuevoTipo, setCrearNuevoTipo] = useState(false);
  const [crearNuevoUsuario, setCrearNuevoUsuario] = useState(false);

  useEffect(() => {
    // Carga select options según vista
    if (view === "Products") {
      categoryAPI.getAllCategorias(token).then(setCategorias);
      sizeAPI.getAllTalles(token).then(setTalles);
      typeAPI.getAllTipos(token).then(setTipos);
    }

    if (view === "Categories") typeAPI.getAllTipos(token).then(setTipos);

    if (view === "Types")
      categoryAPI.getAllCategorias(token).then(setCategorias);

    if (view === "Addresses" || view === "Orders") {
      userAPI.getAllUsuarios(token).then(setUsuarios);
      addressAPI.getAllUsuarioDirecciones(token).then(setDirecciones);
    }

    if (view === "Orders") {
      productAPI.getAllProductos(token).then(setProductos);
    }
  }, [view, token]);

  const handleSubmit = async (values: any) => {
    let payload = { ...values };
    try {
      // Addresses: crear nueva dirección si corresponde
      if (view === "Addresses" && crearNuevaDireccion) {
        const direccionNueva = await addressAPI.createDireccion(token, {
          calle: values.calle,
          localidad: values.localidad,
          cp: values.cp,
        });
        payload.direccion = direccionNueva;
      }
      
      // Products: crear nueva categoría/talle si corresponde
      if (view === "Products") {
        if (crearNuevaCategoria) {
          const nuevaCategoria = await categoryAPI.createCategoria(token, { 
            nombre: values.nuevaCategoriaNombre, 
            tipos: [] 
          });
          payload.categoria = nuevaCategoria;
        }
        if (crearNuevoTalle) {
          const nuevoTalle = await sizeAPI.createTalle(token, {
            sistema: values.nuevoTalleSistema,
            valor: values.nuevoTalleValor,
          });
          payload.talles = [nuevoTalle];
        }
        
        const processedPayload = {
          nombre: payload.nombre,
          precio: payload.precio,
          cantidad: payload.cantidad,
          descripcion: payload.descripcion,
          color: payload.color,
          categoria: payload.categoria,
          tipo: payload.tipo,
          tallesDisponibles: payload.talles ? payload.talles.map((id: number) => ({ id })) : []
        };
        
        const handler = createHandlers[view];
        const ok = await handler(token, processedPayload);
        if (ok) {
          onCreated?.();
          onClose();
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el elemento.' });
        }
        return;
      }
      
      // Categories: crear nuevo tipo si corresponde
      if (view === "Categories" && crearNuevoTipo) {
        const nuevoTipo = await typeAPI.createTipo(token, { nombre: values.nuevoTipoNombre });
        payload.tipos = [...(payload.tipos || []), nuevoTipo.id];
      }
      
      const handler = createHandlers[view];
      const ok = await handler(token, payload);
      if (ok) {
        if (view === "Types") {
          const tiposActualizados = await typeAPI.getAllTipos(token);
          tipoStore.getState().setArrayTipos(tiposActualizados);
        }
        onCreated?.();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el elemento.' });
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Error inesperado.' });
    }
  };

  const renderField = (key: string, values: any, setFieldValue: any) => {
    console.log('renderField llamado con key:', key, 'para view:', view);
    
    // Campos que no deben mostrarse en el formulario
    const camposAuxiliares = [
      "crearNuevoUsuario", "nuevoUsuarioNombre", "nuevoUsuarioEmail", "nuevoUsuarioPassword",
      "crearNuevaDireccion", "nuevaDireccionCalle", "nuevaDireccionLocalidad", "nuevaDireccionCP",
      "productoSeleccionado", "cantidadProducto", "calle", "localidad", "cp"
    ];
    
    // Excluir campos de imagen que se manejan con componentes especiales
    const camposImagen = ["imagenPublicId", "imagenPerfilPublicId"];
    if (camposImagen.includes(key)) return null;
    
    if (camposAuxiliares.includes(key)) return null;
    if (view === "Orders" && (key === "detalle" || key === "total")) return null;



    // Manejar campos específicos
    if (view === "Addresses" || view === "Orders") {
      if (key === "usuario") {
        return (
          <Col md={6} key={key}>
            <BootstrapForm.Group>
              <BootstrapForm.Label><strong>Usuario</strong></BootstrapForm.Label>
              <Field
                as="select"
                name="usuario.id"
                className="form-select"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selected = usuarios.find(o => o.id === +e.target.value);
                  if (selected) {
                    setFieldValue("usuario", selected);
                    setFieldValue("usuarioDireccion", null);
                  }
                }}
              >
                <option value="">Seleccionar usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} ({u.email})
                  </option>
                ))}
              </Field>
              <ErrorMessage name="usuario" component="div" className="text-danger small" />
            </BootstrapForm.Group>
          </Col>
        );
      }
      
      if (key === "usuarioDireccion") {
        const usuarioSeleccionado = values.usuario;
        const direccionesUsuario = direcciones.filter(d => 
          usuarioSeleccionado && d.usuario.id === usuarioSeleccionado.id
        );
        
        return (
          <Col md={6} key={key}>
            <BootstrapForm.Group>
              <BootstrapForm.Label><strong>Dirección</strong></BootstrapForm.Label>
              <Field
                as="select"
                name="usuarioDireccion.id"
                className="form-select"
                disabled={!usuarioSeleccionado}
              >
                <option value="">Seleccionar dirección</option>
                {direccionesUsuario.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.direccion.calle}, {d.direccion.localidad}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="usuarioDireccion" component="div" className="text-danger small" />
            </BootstrapForm.Group>
          </Col>
        );
      }
    }

    // Campos básicos
    const inputType = key === "password" ? "password" : 
                     key === "email" ? "email" : 
                     key === "precio" || key === "cantidad" ? "number" : "text";

    return (
      <Col md={6} key={key}>
        <BootstrapForm.Group>
          <BootstrapForm.Label><strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong></BootstrapForm.Label>
          <Field
            name={key}
            type={inputType}
            className="form-control"
            placeholder={key}
          />
          <ErrorMessage name={key} component="div" className="text-danger small" />
        </BootstrapForm.Group>
      </Col>
    );
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Crear {view}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValuesMap[view]}
          validationSchema={schemaMap[view]}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <Row>
                {view === "Addresses" && (
                  <Col md={12}>
                    <BootstrapForm.Check
                      type="checkbox"
                      label="Crear nueva dirección"
                      checked={crearNuevaDireccion}
                      onChange={(e) => {
                        setCrearNuevaDireccion(e.target.checked);
                        setFieldValue("crearNuevaDireccion", e.target.checked);
                      }}
                      className="mb-3"
                    />
                  </Col>
                )}

                {(() => {
                  const keys = Object.keys(initialValuesMap[view]);
                  console.log('Keys para', view, ':', keys);
                  return keys.map((key) => renderField(key, values, setFieldValue));
                })()}

                {view === "Products" && (
                  <Col md={12}>
                    <BootstrapForm.Group>
                      <BootstrapForm.Label><strong>Imagen del producto</strong></BootstrapForm.Label>
                      <ImageUpload
                        label=""
                        currentImagePublicId={values.imagenPublicId}
                        onImageUpload={async (file) => {
                          const publicId = await uploadImageToCloudinary(file, "productos");
                          setFieldValue("imagenPublicId", publicId);
                          return publicId;
                        }}
                        onImageRemove={() => setFieldValue("imagenPublicId", "")}
                      />
                    </BootstrapForm.Group>
                  </Col>
                )}

                {view === "Users" && (
                  <Col md={12}>
                    <BootstrapForm.Group>
                      <BootstrapForm.Label><strong>Imagen de perfil (opcional)</strong></BootstrapForm.Label>
                      <ImageUpload
                        label=""
                        currentImagePublicId={values.imagenPerfilPublicId && values.imagenPerfilPublicId !== "" ? values.imagenPerfilPublicId : undefined}
                        onImageUpload={async (file) => {
                          const publicId = await uploadImageToCloudinary(file, "usuarios");
                          setFieldValue("imagenPerfilPublicId", publicId);
                          return publicId;
                        }}
                        onImageRemove={() => setFieldValue("imagenPerfilPublicId", "")}
                      />
                    </BootstrapForm.Group>
                  </Col>
                )}

                {view === "Orders" && (
                  <Col md={12}>
                    <BootstrapForm.Group>
                      <BootstrapForm.Label><strong>Productos de la orden</strong></BootstrapForm.Label>
                      <div className="border rounded p-3">
                        {values.detalle && values.detalle.length > 0 ? (
                          values.detalle.map((item: any, index: number) => {
                            const producto = productos.find(p => p.id === item.producto.id);
                            const stockDisponible = producto?.cantidad || 0;
                            const cantidadEnOrden = item.cantidad;
                            const excedeStock = cantidadEnOrden > stockDisponible;
                            
                            return (
                              <div key={index} className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2">
                                <span>
                                  <strong>Producto:</strong> {producto?.nombre || 'Producto no encontrado'} | 
                                  <strong>Cantidad:</strong> {item.cantidad} | 
                                  <strong>Stock:</strong> {stockDisponible}
                                  {excedeStock && (
                                    <Badge bg="danger" className="ms-2">⚠️ Excede stock</Badge>
                                  )}
                                </span>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => {
                                    const newDetalle = values.detalle.filter((_: any, i: number) => i !== index);
                                    setFieldValue("detalle", newDetalle);
                                    const nuevoTotal = newDetalle.reduce((sum: number, item: any) => {
                                      const producto = productos.find(p => p.id === item.producto.id);
                                      return sum + (producto?.precio || 0) * item.cantidad;
                                    }, 0);
                                    setFieldValue("total", nuevoTotal);
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-muted fst-italic">No hay productos agregados</p>
                        )}
                        
                        <div className="mt-3">
                          <Row>
                            <Col md={6}>
                              <Field
                                as="select"
                                name="productoSeleccionado"
                                className="form-select"
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                  const productoId = +e.target.value;
                                  if (productoId) {
                                    setFieldValue("productoSeleccionado", productoId);
                                    setFieldValue("cantidadProducto", 1);
                                  }
                                }}
                              >
                                <option value="">Seleccionar producto</option>
                                {productos.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.nombre} - ${p.precio} (Stock: {p.cantidad})
                                  </option>
                                ))}
                              </Field>
                            </Col>
                            <Col md={3}>
                              <Field
                                name="cantidadProducto"
                                type="number"
                                min="1"
                                placeholder="Cantidad"
                                className="form-control"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const cantidad = parseInt(e.target.value) || 0;
                                  const productoId = values.productoSeleccionado;
                                  const producto = productos.find(p => p.id === productoId);
                                  const stockDisponible = producto?.cantidad || 0;
                                  
                                  if (cantidad > stockDisponible) {
                                    e.target.setCustomValidity(`La cantidad no puede exceder el stock disponible (${stockDisponible})`);
                                  } else {
                                    e.target.setCustomValidity('');
                                  }
                                  
                                  setFieldValue("cantidadProducto", cantidad);
                                }}
                              />
                            </Col>
                            <Col md={3}>
                              <Button
                                variant="success"
                                onClick={() => {
                                  const productoId = values.productoSeleccionado;
                                  const cantidad = values.cantidadProducto;
                                  const producto = productos.find(p => p.id === productoId);
                                  const stockDisponible = producto?.cantidad || 0;
                                  
                                  if (productoId && cantidad && cantidad > 0 && cantidad <= stockDisponible) {
                                    const productoYaAgregado = values.detalle?.some((item: any) => item.producto.id === productoId);
                                    if (productoYaAgregado) {
                                      Swal.fire({
                                        icon: 'warning',
                                        title: 'Producto ya agregado',
                                        text: 'Este producto ya está en la orden.',
                                      });
                                      return;
                                    }
                                    
                                    const newDetalle = [...(values.detalle || []), { producto: { id: productoId }, cantidad }];
                                    setFieldValue("detalle", newDetalle);
                                    setFieldValue("productoSeleccionado", "");
                                    setFieldValue("cantidadProducto", 1);
                                    
                                    const nuevoTotal = newDetalle.reduce((sum: number, item: any) => {
                                      const producto = productos.find(p => p.id === item.producto.id);
                                      return sum + (producto?.precio || 0) * item.cantidad;
                                    }, 0);
                                    setFieldValue("total", nuevoTotal);
                                  } else if (cantidad > stockDisponible) {
                                    Swal.fire({
                                      icon: 'error',
                                      title: 'Stock insuficiente',
                                      text: `La cantidad solicitada (${cantidad}) excede el stock disponible (${stockDisponible})`,
                                    });
                                  }
                                }}
                              >
                                Agregar
                              </Button>
                            </Col>
                          </Row>
                          {values.productoSeleccionado && (
                            <small className="text-muted">
                              Stock disponible: {productos.find(p => p.id === values.productoSeleccionado)?.cantidad || 0} unidades
                            </small>
                          )}
                        </div>
                      </div>
                      <ErrorMessage name="detalle" component="div" className="text-danger small" />
                    </BootstrapForm.Group>
                  </Col>
                )}
              </Row>

              <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Crear
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}; 