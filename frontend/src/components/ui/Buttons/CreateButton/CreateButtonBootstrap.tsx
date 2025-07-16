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
import { direccionStore } from "../../../../store/direccionStore";
import { showErrorAlert } from "../../../../utils/errorHandler";

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
  Users: { 
    nombre: "", 
    email: "", 
    password: "", 
    imagenPerfilPublicId: "",
    direcciones: [],
    nuevaDireccionCalle: "",
    nuevaDireccionLocalidad: "",
    nuevaDireccionCP: ""
  },
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
  Categories: { 
    nombre: "", 
    tipos: [],
    tiposExistentes: [],
    nuevoTipoNombre: ""
  },
  Types: { nombre: "", categorias: [] },
  Sizes: { sistema: "", valor: "" },
  Addresses: { 
    usuario: { id: 0 }, 
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
    tipos: yup.array().of(yup.object({
      nombre: yup.string().required()
    })).min(0),
    tiposExistentes: yup.array().of(yup.object({
      nombre: yup.string().required()
    })).min(0),
    nuevoTipoNombre: yup.string().optional(),
  }),
  Types: yup.object({
    nombre: yup.string().required(),
    categorias: yup.array().of(
      yup.object({ id: yup.number().required(), nombre: yup.string().required() })
    ).min(0),
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
      const { direcciones, ...userData } = payload;
      const result = await userAPI.registrarUsuario(userData);
      
      // Si se creó el usuario exitosamente y hay direcciones, crearlas
      if (result && direcciones && direcciones.length > 0) {
        // Obtener el usuario recién creado para obtener su ID
        const usuarios = await userAPI.getAllUsuarios(token);
        const usuarioCreado = usuarios.find(u => u.email === userData.email);
        
        if (usuarioCreado && usuarioCreado.id) {
          for (const direccionData of direcciones) {
            // Primero crear la dirección
            const direccionCreada = await addressAPI.createDireccion(token, {
              calle: direccionData.calle,
              localidad: direccionData.localidad,
              cp: direccionData.cp
            });
            
            // Luego crear la relación usuario-dirección
            await addressAPI.createUsuarioDireccion(token, {
              usuario: { 
                id: usuarioCreado.id,
                nombre: usuarioCreado.nombre,
                email: usuarioCreado.email
              },
              direccion: direccionCreada
            });
          }
        }
      }
      
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
      
      const result = await categoryAPI.createCategoria(token, categoriaData);
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
      // Primero crear la dirección
      const nuevaDireccion = await addressAPI.createDireccion(token, {
        calle: payload.calle,
        localidad: payload.localidad,
        cp: payload.cp
      });
      
      // Luego crear la relación usuario-dirección
      const result = await addressAPI.createUsuarioDireccion(token, {
        usuario: payload.usuario,
        direccion: nuevaDireccion
      });
      
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
  
  // Store de direcciones de usuario-dirección
  const direccionesFromStore = direccionStore((s) => s.direcciones);
  const [crearNuevaDireccion, setCrearNuevaDireccion] = useState(false);
  const [crearNuevaCategoria, setCrearNuevaCategoria] = useState(false);
  const [crearNuevoTalle, setCrearNuevoTalle] = useState(false);
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
      // Usar direcciones del store si están disponibles, sino cargar desde la API
      if (direccionesFromStore && direccionesFromStore.length > 0) {
        console.log("✅ Usando direcciones del store:", direccionesFromStore.length, "direcciones");
        setDirecciones(direccionesFromStore);
      } else {
        console.log("🔄 Cargando direcciones desde la API...");
        addressAPI.getAllUsuarioDirecciones(token).then(setDirecciones);
      }
    }

    if (view === "Orders") {
      productAPI.getAllProductos(token).then(setProductos);
    }
  }, [view, token, direccionesFromStore]);

  // Actualizar direcciones locales cuando cambie el store
  useEffect(() => {
    console.log("🔄 CreateButtonBootstrap - direccionesFromStore actualizado:", direccionesFromStore);
    if (direccionesFromStore && direccionesFromStore.length > 0) {
      console.log("✅ Actualizando direcciones locales con datos del store");
      setDirecciones(direccionesFromStore);
    } else if (direccionesFromStore && direccionesFromStore.length === 0) {
      console.log("🔄 Store vacío, limpiando direcciones locales");
      setDirecciones([]);
    }
  }, [direccionesFromStore]);

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
      
      const handler = createHandlers[view];
      const ok = await handler(token, payload);
      if (ok) {
        // Actualizar stores según la vista
        if (view === "Categories") {
          // Actualizar categorías y tipos para reflejar la relación
          const [categoriasActualizadas, tiposActualizados] = await Promise.all([
            categoryAPI.getAllCategorias(token),
            typeAPI.getAllTipos(token)
          ]);
          categoriaStore.getState().setArraycategorias(categoriasActualizadas);
          tipoStore.getState().setArrayTipos(tiposActualizados);
        }
        if (view === "Types") {
          // Actualizar tipos y categorías para reflejar la relación
          const [tiposActualizados, categoriasActualizadas] = await Promise.all([
            typeAPI.getAllTipos(token),
            categoryAPI.getAllCategorias(token)
          ]);
          tipoStore.getState().setArrayTipos(tiposActualizados);
          categoriaStore.getState().setArraycategorias(categoriasActualizadas);
        }
        if (view === "Addresses") {
          // Actualizar el store de direcciones con todas las direcciones (incluyendo soft delete)
          const direccionesActualizadas = await addressAPI.getAllUsuarioDirecciones(token);
          direccionStore.getState().setArrayDirecciones(direccionesActualizadas);
          
          // Actualizar el store de usuarios para que aparezcan las direcciones en las ListCard
          const usuariosActualizados = await userAPI.getAllUsuarios(token);
          usuarioStore.getState().setArrayUsuarios(usuariosActualizados);
        }
        onCreated?.();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el elemento.' });
      }
    } catch (err: any) {
      console.error(`Error creating ${view}:`, err);
      showErrorAlert(err, `Error al crear ${view}`);
    }
  };

  const renderField = (key: string, values: any, setFieldValue: any) => {
    console.log('renderField llamado con key:', key, 'para view:', view);
    
    // Campos que no deben mostrarse en el formulario
    const camposAuxiliares = [
      "crearNuevoUsuario", "nuevoUsuarioNombre", "nuevoUsuarioEmail", "nuevoUsuarioPassword",
      "crearNuevaDireccion", "nuevaDireccionCalle", "nuevaDireccionLocalidad", "nuevaDireccionCP",
      "productoSeleccionado", "cantidadProducto",
      "nuevaDireccionCalle", "nuevaDireccionLocalidad", "nuevaDireccionCP",
      "tiposExistentes", "nuevoTipoNombre"
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
                    if (view === "Orders") {
                      setFieldValue("usuarioDireccion", null);
                    }
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
      
      if (key === "usuarioDireccion" && view === "Orders") {
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

    // Manejo especial para tipos en Categories
    if (view === "Categories" && key === "tipos") {
      return (
        <Col md={12} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Tipos</strong></BootstrapForm.Label>
            <Field
              as="select"
              name="tiposExistentes"
              multiple
              className="form-control"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const selectedIds = Array.from(e.target.selectedOptions).map((o) => +o.value);
                const validSelectedIds = selectedIds.filter((id): id is number => typeof id === "number" && !isNaN(id) && id !== undefined);
                setFieldValue(
                  "tiposExistentes",
                  tipos.filter((t) => typeof t.id === 'number' && validSelectedIds.includes(t.id))
                );
              }}
            >
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </Field>
            <div className="form-text">Puedes dejar vacío si la categoría no tiene tipos.</div>
          </BootstrapForm.Group>
        </Col>
      );
    }

    // Manejo especial para categorías en Types
    if (view === "Types" && key === "categorias") {
      // Categorías seleccionadas y no seleccionadas
      const selectedIds = (values.categorias || []).map((c: any) => c.id);
      const categoriasSeleccionadas = categorias.filter((c) => selectedIds.includes(c.id));
      const categoriasNoSeleccionadas = categorias.filter((c) => !selectedIds.includes(c.id));
      return (
        <Col md={12} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Categorías asociadas</strong></BootstrapForm.Label>
            <div className="border rounded p-3">
              <div className="mb-2">
                <strong>Categorías seleccionadas:</strong>
                {categoriasSeleccionadas.length === 0 && (
                  <span className="text-muted ms-2">Ninguna</span>
                )}
                <div className="d-flex flex-wrap mt-2">
                  {categoriasSeleccionadas.map((categoria: any) => (
                    <label key={categoria.id} className="me-3 mb-2" style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => {
                          // Quitar de seleccionadas
                          setFieldValue(
                            "categorias",
                            categoriasSeleccionadas.filter((c: any) => c.id !== categoria.id)
                          );
                        }}
                        className="me-1"
                      />
                      <span className="badge bg-info text-dark">{categoria.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <strong>Otras categorías:</strong>
                {categoriasNoSeleccionadas.length === 0 && (
                  <span className="text-muted ms-2">Ninguna</span>
                )}
                <div className="d-flex flex-wrap mt-2">
                  {categoriasNoSeleccionadas.map((categoria: any) => (
                    <label key={categoria.id} className="me-3 mb-2" style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                          // Agregar a seleccionadas
                          setFieldValue(
                            "categorias",
                            [...categoriasSeleccionadas, categoria]
                          );
                        }}
                        className="me-1"
                      />
                      <span>{categoria.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
              <ErrorMessage name="categorias" component="div" className="text-danger small" />
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
                 key === "cp" ? "CP" : String(key).charAt(0).toUpperCase() + String(key).slice(1)}
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