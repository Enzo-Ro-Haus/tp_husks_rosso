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
import { IOrden } from "../../../../types/IOrden";
import { Rol } from '../../../../types/enums/Rol';
import { SistemaTalle } from '../../../../types/enums/SistemaTalle';
import { MetodoPago } from '../../../../types/enums/MetodoPago';
import { EstadoOrden } from '../../../../types/enums/EstadoOrden';
import { tipoStore } from "../../../../store/tipoStore";
import { categoriaStore } from "../../../../store/categoriaStore";
import { direccionStore } from "../../../../store/direccionStore";

type ViewType =
  | "Users"
  | "Products"
  | "Categories"
  | "Types"
  | "Sizes"
  | "Addresses"
  | "Orders"
  | "Client";

interface Props {
  view: ViewType;
  item: any;
  onClose: () => void;
  onUpdated?: () => void;
}

// Validaciones Yup
const schemaMap: Record<ViewType, yup.ObjectSchema<any>> = {
  Users: yup.object({
    nombre: yup.string().required("❌ Obligatorio"),
    email: yup.string().email().required("❌ Obligatorio"),
    password: yup.string().min(6).optional(),
    imagenPerfilPublicId: yup.string().optional(),
    direcciones: yup.array().of(yup.object({
      calle: yup.string().required(),
      localidad: yup.string().required(),
      cp: yup.string().required()
    })).optional(),
    nuevaDireccionCalle: yup.string().optional(),
    nuevaDireccionLocalidad: yup.string().optional(),
    nuevaDireccionCP: yup.string().optional(),
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
    usuario: yup.object({ id: yup.number().required() }).required("❌ Debe seleccionar un usuario"),
    calle: yup.string().required("❌ Obligatorio"),
    localidad: yup.string().required("❌ Obligatorio"),
    cp: yup.string().required("❌ Obligatorio"),
  }),
  Orders: yup.object({
    usuario: yup.object({ id: yup.number().required() }).required(),
    usuarioDireccion: yup.object({ id: yup.number().required() }).required(),
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
  }),
  Client: yup.object({
    nombre: yup.string().required("❌ Obligatorio"),
    email: yup.string().email().required("❌ Obligatorio"),
    password: yup.string().min(6).optional(),
    imagenPerfilPublicId: yup.string().optional(),
  }),
};

// Handlers para actualizar elementos
const updateHandlers: Record<ViewType, (token: string, id: number, payload: any) => Promise<boolean>> = {
  Users: async (token, id, payload) => {
    try {
      const result = await userAPI.updateUsuario(token, id, payload);
      return !!result;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },
  Products: async (token, id, payload) => {
    try {
      const result = await productAPI.updateProducto(token, id, payload);
      return !!result;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  },
  Categories: async (token, id, payload) => {
    try {
      const tiposIds = [];
      
      // Agregar IDs de tipos existentes seleccionados
      if (payload.tiposExistentes && payload.tiposExistentes.length > 0) {
        for (const tipoData of payload.tiposExistentes) {
          if (tipoData.id) {
            tiposIds.push(tipoData.id);
          }
        }
      }
      
      // Crear nuevos tipos y agregar sus IDs
      if (payload.tipos && payload.tipos.length > 0) {
        for (const tipoData of payload.tipos) {
          if (tipoData.nombre) {
            const nuevoTipo = await typeAPI.createTipo(token, { 
              nombre: tipoData.nombre,
              categorias: []
            });
            if (nuevoTipo && nuevoTipo.id) {
              tiposIds.push(nuevoTipo.id);
            }
          }
        }
      }
      
      // Limpiar campos auxiliares antes de enviar
      const { tiposExistentes, nuevoTipoNombre, ...categoriaData } = payload;
      categoriaData.tipos = tiposIds;
      
      const result = await categoryAPI.updateCategoria(token, id, categoriaData);
      return !!result;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  },
  Types: async (token, id, payload) => {
    try {
      const result = await typeAPI.updateTipo(token, id, payload);
      return !!result;
    } catch (error) {
      console.error('Error updating type:', error);
      return false;
    }
  },
  Sizes: async (token, id, payload) => {
    try {
      const result = await sizeAPI.updateTalle(token, id, payload);
      return !!result;
    } catch (error) {
      console.error('Error updating size:', error);
      return false;
    }
  },
  Addresses: async (token, id, payload) => {
    try {
      // Primero actualizar la dirección física
      const direccionActualizada = await addressAPI.updateDireccion(token, payload.direccion.id, {
        calle: payload.calle,
        localidad: payload.localidad,
        cp: payload.cp
      });
      
      // Luego actualizar la relación usuario-dirección si el usuario cambió
      if (payload.usuario.id !== payload.usuarioOriginal.id) {
        const result = await addressAPI.updateUsuarioDireccion(token, id, {
          usuario: payload.usuario
        });
        return !!result;
      }
      
      return !!direccionActualizada;
    } catch (error) {
      console.error('Error updating address:', error);
      return false;
    }
  },
  Orders: async (token, id, payload) => {
    try {
      const result = await orderAPI.updateOrden(token, id, payload);
      return !!result;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  },
  Client: async (token, id, payload) => {
    try {
      const result = await userAPI.updateUsuario(token, id, payload);
      return !!result;
    } catch (error) {
      console.error('Error updating client:', error);
      return false;
    }
  },
};

const DEFAULT_IMAGE_PUBLIC_ID = "user_img";

export const EditButtonBootstrap: React.FC<Props> = ({ view, item, onClose, onUpdated }) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token)!;

  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [direcciones, setDirecciones] = useState<IUsuarioDireccion[]>([]);
  const [talles, setTalles] = useState<any[]>([]);
  const [productos, setProductos] = useState<IProducto[]>([]);
  
  // Store de direcciones de usuario-dirección
  const direccionesFromStore = direccionStore((s) => s.direcciones);

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
      // Usar direcciones del store si están disponibles, sino cargar desde la API
      if (direccionesFromStore && direccionesFromStore.length > 0) {
        console.log("✅ EditButtonBootstrap - Usando direcciones del store:", direccionesFromStore.length, "direcciones");
        setDirecciones(direccionesFromStore);
      } else {
        console.log("🔄 EditButtonBootstrap - Cargando direcciones desde la API...");
        addressAPI.getAllUsuarioDirecciones(token).then(setDirecciones);
      }
    }

    if (view === "Orders") {
      productAPI.getAllProductos(token).then(setProductos);
    }
  }, [view, token, direccionesFromStore]);

  // Actualizar direcciones locales cuando cambie el store
  useEffect(() => {
    console.log("🔄 EditButtonBootstrap - direccionesFromStore actualizado:", direccionesFromStore);
    if (direccionesFromStore && direccionesFromStore.length > 0) {
      console.log("✅ Actualizando direcciones locales con datos del store");
      setDirecciones(direccionesFromStore);
    } else if (direccionesFromStore && direccionesFromStore.length === 0) {
      console.log("🔄 Store vacío, limpiando direcciones locales");
      setDirecciones([]);
    }
  }, [direccionesFromStore]);

  const handleSubmit = async (values: any) => {
    try {
      let payload = { ...values };
      
      // Para Users, solo incluir password si se proporcionó una nueva
      if (view === "Users" || view === "Client") {
        const { password, direcciones, nuevaDireccionCalle, nuevaDireccionLocalidad, nuevaDireccionCP, ...rest } = values;
        payload = { ...rest };
        if (password && password.trim() !== "") {
          payload.password = password;
        }
        
        // Manejar direcciones para Users
        if (view === "Users") {
          try {
            // Obtener direcciones activas del usuario
            const direccionesActuales = await addressAPI.getActiveUsuarioDirecciones(token);
            let direccionesUsuario: any[] = [];
            if (item.id !== undefined) {
              direccionesUsuario = direccionesActuales.filter(d => d.usuario.id === item.id);
            }
            
            // Obtener IDs de direcciones que ya no están en la lista (para eliminar)
            const direccionesActualesIds = direccionesUsuario.map(d => d.id);
            const direccionesMantenerIds = direcciones
              .filter((d: any) => d.usuarioDireccionId)
              .map((d: any) => d.usuarioDireccionId);
            
            const direccionesAEliminar = direccionesActualesIds.filter(id => !direccionesMantenerIds.includes(id));
            
            // Eliminar direcciones que ya no están en la lista (soft delete)
            for (const id of direccionesAEliminar) {
              try {
                if (id !== undefined) {
                  await addressAPI.softDeleteUsuarioDireccion(token, id);
                }
              } catch (error) {
                console.error(`Error eliminando dirección ${id}:`, error);
              }
            }
            
            // Agregar nuevas direcciones (las que no tienen usuarioDireccionId)
            for (const direccion of direcciones) {
              if (!direccion.usuarioDireccionId) {
                try {
                  // Primero crear la dirección
                  const direccionCreada = await addressAPI.createDireccion(token, {
                    calle: direccion.calle,
                    localidad: direccion.localidad,
                    cp: direccion.cp
                  });
                  
                  // Luego crear la relación usuario-dirección
                  if (item.id === undefined) {
                    Swal.fire({ icon: 'error', title: 'Error', text: 'ID del usuario no encontrado.' });
                    return;
                  }
                  await addressAPI.createUsuarioDireccion(token, {
                    usuario: { 
                      id: item.id,
                      nombre: item.nombre,
                      email: item.email
                    },
                    direccion: direccionCreada
                  });
                } catch (error) {
                  console.error('Error creando nueva dirección:', error);
                  throw new Error(`Error al crear dirección: ${direccion.calle}, ${direccion.localidad}`);
                }
              }
            }
          } catch (error) {
            console.error('Error manejando direcciones:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error con direcciones',
              text: error instanceof Error ? error.message : 'Error al actualizar direcciones',
            });
            return;
          }
        }
      }
      
      if (!item.id) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'ID del elemento no encontrado.' });
        return;
      }
      
      const handler = updateHandlers[view];
      const ok = await handler(token, item.id, payload);
      if (ok) {
        // Actualizar stores según la vista
        if (view === "Users") {
          // Actualizar el store de usuarios con los datos actualizados
          const usuariosActualizados = await userAPI.getAllUsuarios(token);
          usuarioStore.getState().setArrayUsuarios(usuariosActualizados);
          
          // Actualizar el store de direcciones con TODAS las direcciones (incluyendo soft delete)
          const direccionesActualizadas = await addressAPI.getAllUsuarioDirecciones(token);
          direccionStore.getState().setArrayDirecciones(direccionesActualizadas);
        }
        if (view === "Categories") {
          const categoriasActualizadas = await categoryAPI.getAllCategorias(token);
          categoriaStore.getState().setArraycategorias(categoriasActualizadas);
        }
        if (view === "Types") {
          const tiposActualizados = await typeAPI.getAllTipos(token);
          tipoStore.getState().setArrayTipos(tiposActualizados);
        }
        if (view === "Addresses") {
          // Actualizar el store de direcciones con todas las direcciones (incluyendo soft delete)
          const direccionesActualizadas = await addressAPI.getAllUsuarioDirecciones(token);
          direccionStore.getState().setArrayDirecciones(direccionesActualizadas);
        }
        onUpdated?.();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el elemento.' });
      }
    } catch (err: any) {
      console.error('Error en handleSubmit:', err);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: err?.message || 'Error inesperado al actualizar.' 
      });
    }
  };

  const getInitialValues = () => {
    // Validar que item existe
    if (!item) {
      console.error('EditButtonBootstrap: item is undefined or null');
      return {};
    }

    switch (view) {
      case "Users":
        // Convertir UsuarioDireccion[] a objetos de dirección simples
        const direccionesSimples = item.direcciones ? item.direcciones.map((ud: any) => ({
          calle: ud.direccion?.calle || '',
          localidad: ud.direccion?.localidad || '',
          cp: ud.direccion?.cp || '',
          usuarioDireccionId: ud.id // Guardar el ID para poder eliminar después
        })) : [];
        
        return {
          nombre: item.nombre || "",
          email: item.email || "",
          password: "", // Siempre vacío en edición
          imagenPerfilPublicId: item.imagenPerfilPublicId || "",
          direcciones: direccionesSimples,
          nuevaDireccionCalle: "",
          nuevaDireccionLocalidad: "",
          nuevaDireccionCP: ""
        };
      case "Products":
        return {
          nombre: item.nombre || "",
          cantidad: item.cantidad || 1,
          precio: item.precio || 0.01,
          color: item.color || "",
          talles: item.tallesDisponibles?.map((t: any) => t.id) || [],
          categoria: item.categoria || { id: 0 },
          tipo: item.tipo || { id: 0 },
          descripcion: item.descripcion || "",
          imagenPublicId: item.imagenPublicId || "",
        };
      case "Categories":
        return {
          nombre: item.nombre || "",
          tipos: [],
          tiposExistentes: item.tipos?.map((t: any) => ({ id: t.id, nombre: t.nombre })) || [],
        };
      case "Types":
        return {
          nombre: item.nombre || "",
          categorias: item.categorias || [],
        };
      case "Sizes":
        return {
          sistema: item.sistema || "",
          valor: item.valor || "",
        };
      case "Addresses":
        return {
          usuario: item.usuario || { id: 0 },
          usuarioOriginal: item.usuario || { id: 0 }, // Guardar usuario original para comparar
          direccion: item.direccion || { id: 0 },
          calle: item.direccion?.calle || "",
          localidad: item.direccion?.localidad || "",
          cp: item.direccion?.cp || "",
        };
      case "Orders":
        return {
          usuario: item.usuario || null,
          usuarioDireccion: item.usuarioDireccion || null,
          detalle: item.detalle || [],
          fecha: item.fecha || new Date().toISOString().slice(0, 10),
          total: item.total || 0,
          metodoPago: item.metodoPago || "",
          estado: item.estado || "",
          productoSeleccionado: "",
          cantidadProducto: 1,
        };
      case "Client":
        return {
          nombre: item.nombre || "",
          email: item.email || "",
          password: item.password || "",
          imagenPerfilPublicId: item.imagenPerfilPublicId || "",
        };
      default:
        return {};
    }
  };

  const renderField = (key: string, values: any, setFieldValue: any) => {
    // Campos que no deben mostrarse en el formulario
    const camposAuxiliares = [
      "productoSeleccionado", "cantidadProducto",
      "nuevaDireccionCalle", "nuevaDireccionLocalidad", "nuevaDireccionCP",
      "usuarioOriginal"
    ];
    
    // Excluir campos de imagen que se manejan con componentes especiales
    const camposImagen = ["imagenPublicId", "imagenPerfilPublicId"];
    if (camposImagen.includes(key)) return null;
    
    if (camposAuxiliares.includes(key)) return null;
    if (view === "Orders" && (key === "detalle" || key === "total")) return null;

    // Manejo especial para direcciones en Users
    if (view === "Users" && key === "direcciones") {
      return (
        <Col md={12} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Direcciones</strong></BootstrapForm.Label>
            <div className="border rounded p-3">
              {values.direcciones && values.direcciones.length > 0 ? (
                values.direcciones.map((direccion: any, index: number) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2">
                    <span>
                      <strong>Dirección {index + 1}:</strong> {direccion.calle}, {direccion.localidad} ({direccion.cp})
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        const newDirecciones = values.direcciones.filter((_: any, i: number) => i !== index);
                        setFieldValue("direcciones", newDirecciones);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted fst-italic">No hay direcciones agregadas</p>
              )}
              
              <div className="mt-3">
                <Row>
                  <Col md={4}>
                    <Field
                      name="nuevaDireccionCalle"
                      placeholder="Calle"
                      className="form-control"
                    />
                  </Col>
                  <Col md={4}>
                    <Field
                      name="nuevaDireccionLocalidad"
                      placeholder="Localidad"
                      className="form-control"
                    />
                  </Col>
                  <Col md={3}>
                    <Field
                      name="nuevaDireccionCP"
                      placeholder="CP"
                      className="form-control"
                    />
                  </Col>
                  <Col md={1}>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        const nuevaDireccion = {
                          calle: values.nuevaDireccionCalle,
                          localidad: values.nuevaDireccionLocalidad,
                          cp: values.nuevaDireccionCP
                        };
                        
                        if (nuevaDireccion.calle && nuevaDireccion.localidad && nuevaDireccion.cp) {
                          const newDirecciones = [...(values.direcciones || []), nuevaDireccion];
                          setFieldValue("direcciones", newDirecciones);
                          setFieldValue("nuevaDireccionCalle", "");
                          setFieldValue("nuevaDireccionLocalidad", "");
                          setFieldValue("nuevaDireccionCP", "");
                        }
                      }}
                    >
                      +
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </BootstrapForm.Group>
        </Col>
      );
    }

    // Manejo especial para tipos en Categories
    if (view === "Categories" && key === "tipos") {
      return (
        <Col md={12} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Tipos</strong></BootstrapForm.Label>
            <div className="border rounded p-3">
              {/* Selector de tipos existentes */}
              <div className="mb-3">
                <label className="form-label"><strong>Seleccionar tipos existentes:</strong></label>
                <Field
                  as="select"
                  multiple
                  name="tiposExistentes"
                  className="form-select"
                  value={(values.tiposExistentes || []).map((t: any) => t.id)}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const ids = Array.from(e.target.selectedOptions).map((o) => +o.value);
                    const tiposSeleccionados = tipos.filter(t => t.id && ids.includes(t.id));
                    setFieldValue("tiposExistentes", tiposSeleccionados);
                  }}
                >
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </Field>
                <small className="text-muted">
                  Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples tipos
                </small>
              </div>
              
              {/* Campo para crear nuevo tipo */}
              <div className="mb-3">
                <label className="form-label"><strong>Crear nuevo tipo:</strong></label>
                <Row>
                  <Col md={11}>
                    <Field
                      name="nuevoTipoNombre"
                      placeholder="Nombre del nuevo tipo"
                      className="form-control"
                    />
                  </Col>
                  <Col md={1}>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        const nuevoTipo = {
                          nombre: values.nuevoTipoNombre
                        };
                        
                        if (nuevoTipo.nombre && nuevoTipo.nombre.trim()) {
                          const newTipos = [...(values.tipos || []), nuevoTipo];
                          setFieldValue("tipos", newTipos);
                          setFieldValue("nuevoTipoNombre", "");
                        }
                      }}
                    >
                      +
                    </Button>
                  </Col>
                </Row>
              </div>
              
              {/* Lista de todos los tipos seleccionados */}
              <div className="mt-3">
                <strong>Tipos seleccionados:</strong>
                <div className="mt-2">
                  {/* Tipos existentes */}
                  {values.tiposExistentes && values.tiposExistentes.length > 0 && (
                    <div className="mb-2">
                      <small className="text-muted">Tipos existentes:</small>
                      <div>
                        {values.tiposExistentes.map((tipo: any) => (
                          <Badge key={tipo.id} bg="primary" className="me-2 mb-1">
                            {tipo.nombre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Nuevos tipos */}
                  {values.tipos && values.tipos.length > 0 && (
                    <div className="mb-2">
                      <small className="text-muted">Nuevos tipos a crear:</small>
                      <div>
                        {values.tipos.map((tipo: any, index: number) => (
                          <div key={index} className="d-inline-block me-2 mb-1">
                            <Badge bg="success" className="me-1">
                              {tipo.nombre}
                            </Badge>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                const newTipos = values.tipos.filter((_: any, i: number) => i !== index);
                                setFieldValue("tipos", newTipos);
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(!values.tiposExistentes || values.tiposExistentes.length === 0) && 
                   (!values.tipos || values.tipos.length === 0) && (
                    <p className="text-muted fst-italic">No hay tipos seleccionados</p>
                  )}
                </div>
              </div>
            </div>
          </BootstrapForm.Group>
        </Col>
      );
    }

    // Manejo especial para categorías en Types
    if (view === "Types" && key === "categorias") {
      return (
        <Col md={12} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Categorías</strong></BootstrapForm.Label>
            <div className="border rounded p-3">
              <div className="mb-3">
                <Field
                  as="select"
                  multiple
                  name="categorias"
                  className="form-select"
                  value={(values.categorias || []).map((c: any) => c.id).filter((id: any) => id !== undefined)}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const ids = Array.from(e.target.selectedOptions).map((o) => +o.value);
                    const categoriasSeleccionadas = categorias.filter(c => c.id && ids.includes(c.id));
                    setFieldValue("categorias", categoriasSeleccionadas);
                  }}
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </Field>
                <small className="text-muted">
                  Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples categorías
                </small>
                <ErrorMessage name="categorias" component="div" className="text-danger small" />
              </div>
              
              {/* Mostrar categorías seleccionadas */}
              {values.categorias && values.categorias.length > 0 && (
                <div className="mt-3">
                  <strong>Categorías seleccionadas:</strong>
                  <div className="mt-2">
                    {values.categorias.map((categoria: any) => (
                      <Badge key={categoria.id} bg="info" className="me-2 mb-1">
                        {categoria.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {(!values.categorias || values.categorias.length === 0) && (
                <div className="mt-3">
                  <p className="text-muted fst-italic">No hay categorías seleccionadas</p>
                </div>
              )}
            </div>
          </BootstrapForm.Group>
        </Col>
      );
    }

    // Manejo específico para campos de dirección en Addresses
    if (view === "Addresses" && (key === "calle" || key === "localidad" || key === "cp")) {
      return (
        <Col md={4} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label>
              <strong>
                {key === "calle" ? "Calle" : 
                 key === "localidad" ? "Localidad" : 
                 key === "cp" ? "CP" : key.charAt(0).toUpperCase() + key.slice(1)}
              </strong>
            </BootstrapForm.Label>
            <Field
              name={key}
              type="text"
              className="form-control"
              placeholder={key === "calle" ? "Nombre de la calle" : 
                         key === "localidad" ? "Ciudad/Localidad" : 
                         key === "cp" ? "Código Postal" : key}
            />
            <ErrorMessage name={key} component="div" className="text-danger small" />
          </BootstrapForm.Group>
        </Col>
      );
    }

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
                  <option key={u.id} value={u.id} selected={values.usuario?.id === u.id}>
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
                  <option key={d.id} value={d.id} selected={values.usuarioDireccion?.id === d.id}>
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
          <BootstrapForm.Label>
            <strong>
              {key === "password" ? "Contraseña (opcional)" : key.charAt(0).toUpperCase() + key.slice(1)}
            </strong>
          </BootstrapForm.Label>
          <Field
            name={key}
            type={inputType}
            className="form-control"
            placeholder={key === "password" ? "Dejar vacío para mantener la actual" : key}
          />
          <ErrorMessage name={key} component="div" className="text-danger small" />
        </BootstrapForm.Group>
      </Col>
    );
  };

  // Validar que tenemos datos válidos para editar
  if (!item) {
    console.error('EditButtonBootstrap: No se puede editar sin datos válidos');
    return null;
  }

  return (
    <Modal show={true} onHide={onClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar {view}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={schemaMap[view]}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <Row>
                {Object.keys(getInitialValues()).map((key) => 
                  renderField(key, values, setFieldValue)
                )}

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
                                  <strong>Cantidad:</strong> {item.cantidad || 0} | 
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
                                      return sum + (producto?.precio || 0) * (item.cantidad || 0);
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
                                      return sum + (producto?.precio || 0) * (item.cantidad || 0);
                                    }, 0);
                                    setFieldValue("total", nuevoTotal);
                                  } else if (cantidad && Number(cantidad) > stockDisponible) {
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
                              Stock disponible: {productos.find(p => p.id === Number(values.productoSeleccionado))?.cantidad || 0} unidades
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
                  Actualizar
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};