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

// Funciones helper para convertir enums a valores amigables
const getMetodoPagoLabel = (value: string) => {
  switch (value) {
    case MetodoPago.Tarjeta: return "Tarjeta";
    case MetodoPago.Efectivo: return "Efectivo";
    case MetodoPago.Transferencia: return "Transferencia";
    default: return value;
  }
};

const getEstadoOrdenLabel = (value: string) => {
  switch (value) {
    case EstadoOrden.En_proceso: return "En proceso";
    case EstadoOrden.Enviado: return "Enviado";
    case EstadoOrden.Entregado: return "Entregado";
    default: return value;
  }
};

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
    categoria: null,
    tipo: null,
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
    detalles: [],
    fecha: new Date().toISOString().slice(0, 16), // Formato YYYY-MM-DDTHH:mm para input type="datetime-local"
    precioTotal: 0,
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
    nombre: yup.string().required("❌ El nombre es obligatorio"),
    cantidad: yup.number().min(1, "❌ La cantidad debe ser mayor a 0").required("❌ La cantidad es obligatoria"),
    precio: yup.number().min(0.01, "❌ El precio debe ser mayor a 0").required("❌ El precio es obligatorio"),
    color: yup.string().required("❌ El color es obligatorio"),
    talles: yup.array().of(yup.number().min(1, "❌ Debe seleccionar un talle válido")).length(1, "❌ Debe seleccionar exactamente un talle").required("❌ El talle es obligatorio"),
    categoria: yup.object({ 
      id: yup.number().min(1, "❌ Debe seleccionar una categoría válida").required("❌ Debe seleccionar una categoría") 
    }).nullable().required("❌ Debe seleccionar una categoría"),
    tipo: yup.object({ 
      id: yup.number().min(1, "❌ Debe seleccionar un tipo válido").required("❌ Debe seleccionar un tipo") 
    }).nullable().required("❌ Debe seleccionar un tipo"),
    descripcion: yup.string().required("❌ La descripción es obligatoria"),
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
    detalles: yup
      .array()
      .of(
        yup.object({
          producto: yup.object({ id: yup.number().required() }).required(),
          cantidad: yup.number().min(1).required(),
        })
      )
      .min(1, "Debe agregar al menos un producto"),
    fecha: yup.string().required(),
    precioTotal: yup.number().min(0).required(),
    metodoPago: yup.string().oneOf(Object.values(MetodoPago), "❌ Debe seleccionar un método de pago válido").required("❌ El método de pago es obligatorio"),
    estado: yup.string().oneOf(Object.values(EstadoOrden), "❌ Debe seleccionar un estado válido").required("❌ El estado es obligatorio"),
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
      console.log('🔍 Products handler - payload original:', payload);
      
      // Obtener los datos completos de categoría, tipo y talles
      const categorias = await categoryAPI.getAllCategorias(token);
      const tipos = await typeAPI.getAllTipos(token);
      const talles = await sizeAPI.getAllTalles(token);
      
      // Encontrar los objetos completos basados en los IDs
      const categoriaCompleta = payload.categoria && payload.categoria.id ? categorias.find(c => c.id === payload.categoria.id) : null;
      const tipoCompleto = payload.tipo && payload.tipo.id ? tipos.find(t => t.id === payload.tipo.id) : null;
      const talleCompleto = payload.talles?.[0] ? talles.find(t => t.id === payload.talles[0]) : null;
      
      console.log('🔍 Products handler - objetos encontrados:', {
        categoria: categoriaCompleta,
        tipo: tipoCompleto,
        talle: talleCompleto
      });
      
      // Validar que se encontraron todos los objetos necesarios
      if (!categoriaCompleta) {
        throw new Error(`No se encontró la categoría con ID ${payload.categoria?.id || 'no proporcionado'}`);
      }
      if (!tipoCompleto) {
        throw new Error(`No se encontró el tipo con ID ${payload.tipo?.id || 'no proporcionado'}`);
      }
      if (!talleCompleto) {
        throw new Error('No se encontró el talle seleccionado');
      }
      
      // Crear el payload con la estructura correcta
      const processedPayload = {
        nombre: payload.nombre,
        precio: payload.precio,
        cantidad: payload.cantidad,
        descripcion: payload.descripcion,
        color: payload.color,
        categoria: categoriaCompleta!,
        tipo: tipoCompleto!,
        tallesDisponibles: [talleCompleto],
        imagenPublicId: payload.imagenPublicId || undefined
      };
      
      console.log('🔍 Products handler - payload procesado:', processedPayload);
      
      const result = await productAPI.createProducto(token, processedPayload);
      console.log('🔍 Products handler - resultado:', result);
      return !!result;
    } catch (error) {
      console.error('❌ Error creating product:', error);
      return false;
    }
  },
  Categories: async (token, payload) => {
    try {
      // Obtener los IDs de los tipos seleccionados desde 'tipos'
      let tiposIds = [];
      if (payload.tipos && payload.tipos.length > 0) {
        tiposIds = payload.tipos.map((tipo: any) => tipo.id ?? tipo);
      }
      const result = await categoryAPI.createCategoria(token, payload.nombre, tiposIds);
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
      
      // Products: manejo simplificado ya que el handler se encarga de procesar los talles
      if (view === "Products") {
        console.log('🔍 handleSubmit - Products values:', values);
        console.log('🔍 handleSubmit - Products payload:', payload);
        
        const handler = createHandlers[view];
        const ok = await handler(token, payload);
        if (ok) {
          onCreated?.();
          onClose();
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el producto.' });
        }
        return;
      }
      
      // Eliminar lógica de creación de nuevos Types en Categories
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
    if (view === "Orders" && (key === "detalles" || key === "precioTotal")) return null;

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
              <BootstrapForm.Label><strong>Dirección (primero elija un usuario válido)</strong></BootstrapForm.Label>
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
      // Tipos seleccionados y no seleccionados
      const selectedIds = (values.tipos || []).map((t: any) => t.id);
      const tiposSeleccionados = tipos.filter((t) => selectedIds.includes(t.id));
      const tiposNoSeleccionados = tipos.filter((t) => !selectedIds.includes(t.id));
      return (
        <Col md={12} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Tipos asociados</strong></BootstrapForm.Label>
            <div className="border rounded p-3">
              <div className="mb-2">
                <strong>Tipos seleccionados:</strong>
                {tiposSeleccionados.length === 0 && (
                  <span className="text-muted ms-2">Ninguno</span>
                )}
                <div className="d-flex flex-wrap mt-2">
                  {tiposSeleccionados.map((tipo: any) => (
                    <label key={tipo.id} className="me-3 mb-2" style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => {
                          setFieldValue(
                            "tipos",
                            tiposSeleccionados.filter((t: any) => t.id !== tipo.id)
                          );
                        }}
                        className="me-1"
                      />
                      <span className="badge bg-info text-dark">{tipo.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <strong>Otros tipos:</strong>
                {tiposNoSeleccionados.length === 0 && (
                  <span className="text-muted ms-2">Ninguno</span>
                )}
                <div className="d-flex flex-wrap mt-2">
                  {tiposNoSeleccionados.map((tipo: any) => (
                    <label key={tipo.id} className="me-3 mb-2" style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                          setFieldValue(
                            "tipos",
                            [...tiposSeleccionados, tipo]
                          );
                        }}
                        className="me-1"
                      />
                      <span>{tipo.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
              <ErrorMessage name="tipos" component="div" className="text-danger small" />
            </div>
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

    // Manejo especial para campos de Products
    if (view === "Products") {
      if (key === "categoria") {
        return (
          <Col md={6} key={key}>
            <BootstrapForm.Group>
              <BootstrapForm.Label><strong>Categoría</strong></BootstrapForm.Label>
              <Field
                as="select"
                name="categoria.id"
                className="form-select"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selected = categorias.find(c => c.id === +e.target.value);
                  if (selected) {
                    setFieldValue("categoria", selected);
                  } else {
                    setFieldValue("categoria", null);
                  }
                }}
                value={values.categoria && values.categoria.id ? values.categoria.id : ""}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="categoria" component="div" className="text-danger small" />
            </BootstrapForm.Group>
          </Col>
        );
      }
      
      if (key === "tipo") {
        return (
          <Col md={6} key={key}>
            <BootstrapForm.Group>
              <BootstrapForm.Label><strong>Tipo</strong></BootstrapForm.Label>
              <Field
                as="select"
                name="tipo.id"
                className="form-select"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selected = tipos.find(t => t.id === +e.target.value);
                  if (selected) {
                    setFieldValue("tipo", selected);
                  } else {
                    setFieldValue("tipo", null);
                  }
                }}
                value={values.tipo && values.tipo.id ? values.tipo.id : ""}
              >
                <option value="">Seleccionar tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tipo" component="div" className="text-danger small" />
            </BootstrapForm.Group>
          </Col>
        );
      }
      
      if (key === "talles") {
        return (
          <Col md={6} key={key}>
            <BootstrapForm.Group>
              <BootstrapForm.Label><strong>Talle</strong></BootstrapForm.Label>
              <Field
                as="select"
                name="talles"
                className="form-select"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selected = talles.find(t => t.id === +e.target.value);
                  if (selected) {
                    setFieldValue("talles", [selected.id]);
                  } else {
                    setFieldValue("talles", []);
                  }
                }}
                value={values.talles && values.talles[0] ? values.talles[0] : ""}
              >
                <option value="">Seleccionar talle</option>
                {talles.map((talle) => (
                  <option key={talle.id} value={talle.id}>
                    {talle.sistema} - {talle.valor}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="talles" component="div" className="text-danger small" />
            </BootstrapForm.Group>
          </Col>
        );
      }
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
                     key === "precio" || key === "cantidad" ? "number" : 
                     key === "fecha" ? "datetime-local" : "text";

    // Campos específicos para Sizes
    if (view === "Sizes" && key === "sistema") {
      return (
        <BootstrapForm.Group key={key} className="mb-3" controlId={key}>
          <BootstrapForm.Label><b>Sistema de Talle</b></BootstrapForm.Label>
          <Field name={key}>
            {({ field }: any) => (
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.5rem' }}>
                {Object.values(SistemaTalle).map((v) => (
                  <BootstrapForm.Check
                    key={v}
                    type="radio"
                    id={`sistema-${v}`}
                    label={v.charAt(0).toUpperCase() + v.slice(1)}
                    value={v}
                    checked={field.value === v}
                    onChange={() => field.onChange({ target: { name: key, value: v } })}
                    name={field.name}
                    className="me-2"
                  />
                ))}
              </div>
            )}
          </Field>
          <ErrorMessage name={key} component="div" className="error-message visible" />
        </BootstrapForm.Group>
      );
    }
    if (view === "Sizes" && key === "valor") {
      return (
        <BootstrapForm.Group key={key} className="mb-3" controlId={key}>
          <BootstrapForm.Label><b>Valor</b></BootstrapForm.Label>
          <Field name={key}>
            {({ field }: any) => (
              <BootstrapForm.Control type="text" {...field} />
            )}
          </Field>
          <ErrorMessage name={key} component="div" className="error-message visible" />
        </BootstrapForm.Group>
      );
    }

    // Manejo específico para el campo fecha en Orders
    if (view === "Orders" && key === "fecha") {
      return (
        <Col md={6} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Fecha de la orden</strong></BootstrapForm.Label>
            <Field
              name={key}
              type="datetime-local"
              className="form-control"
              placeholder="Seleccionar fecha y hora"
            />
            <small className="text-muted">Seleccione la fecha y hora de la orden</small>
            <ErrorMessage name={key} component="div" className="text-danger small" />
          </BootstrapForm.Group>
        </Col>
      );
    }

    // Manejo específico para el campo metodoPago en Orders
    if (view === "Orders" && key === "metodoPago") {
      return (
        <Col md={6} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Método de pago</strong></BootstrapForm.Label>
            <Field
              as="select"
              name={key}
              className="form-select"
            >
              <option value="">Seleccionar método de pago</option>
              {Object.values(MetodoPago).map((metodo) => (
                <option key={metodo} value={metodo}>
                  {getMetodoPagoLabel(metodo)}
                </option>
              ))}
            </Field>
            <ErrorMessage name={key} component="div" className="text-danger small" />
          </BootstrapForm.Group>
        </Col>
      );
    }

    // Manejo específico para el campo estado en Orders
    if (view === "Orders" && key === "estado") {
      return (
        <Col md={6} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Estado de la orden</strong></BootstrapForm.Label>
            <Field
              as="select"
              name={key}
              className="form-select"
            >
              <option value="">Seleccionar estado</option>
              {Object.values(EstadoOrden).map((estado) => (
                <option key={estado} value={estado}>
                  {getEstadoOrdenLabel(estado)}
                </option>
              ))}
            </Field>
            <ErrorMessage name={key} component="div" className="text-danger small" />
          </BootstrapForm.Group>
        </Col>
      );
    }

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
                        {values.detalles && values.detalles.length > 0 ? (
                          values.detalles.map((item: any, index: number) => {
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
                                    const newDetalles = values.detalles.filter((_: any, i: number) => i !== index);
                                    setFieldValue("detalles", newDetalles);
                                    const nuevoTotal = newDetalles.reduce((sum: number, item: any) => {
                                      const producto = productos.find(p => p.id === item.producto.id);
                                      return sum + (producto?.precio || 0) * item.cantidad;
                                    }, 0);
                                    setFieldValue("precioTotal", nuevoTotal);
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
                                    const productoYaAgregado = values.detalles?.some((item: any) => item.producto.id === productoId);
                                                                      if (productoYaAgregado) {
                                    Swal.fire({
                                      icon: 'warning',
                                      title: 'Producto ya agregado',
                                      text: 'Este producto ya está en la orden.',
                                    });
                                    return;
                                  }
                                  
                                  const newDetalles = [...(values.detalles || []), { producto: { id: productoId }, cantidad }];
                                  setFieldValue("detalles", newDetalles);
                                  setFieldValue("productoSeleccionado", "");
                                  setFieldValue("cantidadProducto", 1);
                                  
                                  const nuevoTotal = newDetalles.reduce((sum: number, item: any) => {
                                    const producto = productos.find(p => p.id === item.producto.id);
                                    return sum + (producto?.precio || 0) * item.cantidad;
                                  }, 0);
                                  setFieldValue("precioTotal", nuevoTotal);
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
                      <ErrorMessage name="detalles" component="div" className="text-danger small" />
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