// src/components/ui/Buttons/CreateButton/CreateButton.tsx

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal, Button, Form as BootstrapForm, Row, Col, Alert } from "react-bootstrap";
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
    // Campos opcionales para crear nuevo usuario
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
    // Campos para crear nueva dirección
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
    // Campos para agregar productos
    productoSeleccionado: yup.string(),
    cantidadProducto: yup.number().min(1),
  }),
};

const DEFAULT_IMAGE_PUBLIC_ID = "user_img";

// Handlers de creación
const createHandlers: Record<
  ViewType,
  (token: string, values: any) => Promise<boolean>
> = {
  Users: async (_token, values) => {
    // Si no hay imagen, usar la por defecto
    const payload = {
      nombre: values.nombre,
      email: values.email,
      password: values.password,
      imagenPerfilPublicId: values.imagenPerfilPublicId || DEFAULT_IMAGE_PUBLIC_ID,
    };
    const res = await userAPI.registrarUsuario(payload);
    if (res && res.usuario) {
      usuarioStore.getState().agregarNuevoUsuario(res.usuario);
      return true;
    }
    return false;
  },

  Products: async (token, values) =>
    !!(await productAPI.createProducto(token, values)),

  Categories: async (token, values) => {
    // Enviar solo el nombre y los IDs de los tipos seleccionados
    const tiposIds = values.tipos;
    const nuevaCategoria = await categoryAPI.createCategoria(token, values.nombre, tiposIds);
    categoriaStore.getState().agregarNuevaCategiria(nuevaCategoria);
    return !!nuevaCategoria;
  },

  Types: async (token, values) => {
    // Enviar los objetos completos de categoría
    const payload = {
      nombre: values.nombre,
      categorias: values.categorias, // ya es array de objetos
    };
    const nuevoTipo = await typeAPI.createTipo(token, payload);
    tipoStore.getState().agregarNuevoTipo(nuevoTipo);
    return !!nuevoTipo;
  },

  Sizes: async (token, values) => !!(await sizeAPI.createTalle(token, values)),

  Addresses: async (token, values) => {
    try {
      // Si se va a crear una nueva dirección
      if (values.crearNuevaDireccion && values.calle && values.localidad && values.cp) {
        // Crear nueva dirección
        const nuevaDireccion = await addressAPI.createDireccion(token, {
          calle: values.calle,
          localidad: values.localidad,
          cp: values.cp
        });
        
        // Crear la relación usuario-dirección
        return !!(await addressAPI.createUsuarioDireccion(token, {
          usuario: values.usuario,
          direccion: nuevaDireccion
        }));
      } else {
        // Asignar dirección existente a usuario
        return !!(await addressAPI.createUsuarioDireccion(token, {
          usuario: values.usuario,
          direccion: values.direccion
        }));
      }
    } catch (error) {
      console.error('Error creando dirección:', error);
      throw error;
    }
  },

  Orders: async (token, values) => {
    let payload = { ...values };
    
    try {
      // Si se va a crear un nuevo usuario
      if (values.crearNuevoUsuario && values.nuevoUsuarioNombre && values.nuevoUsuarioEmail && values.nuevoUsuarioPassword) {
        const nuevoUsuario = await userAPI.registrarUsuario({
          nombre: values.nuevoUsuarioNombre,
          email: values.nuevoUsuarioEmail,
          password: values.nuevoUsuarioPassword,
          rol: Rol.CLIENTE
        });
        payload.usuario = nuevoUsuario.usuario.id;
      }
      
      // Si se va a crear una nueva dirección para el usuario seleccionado
      if (values.crearNuevaDireccion && values.nuevaDireccionCalle && values.nuevaDireccionLocalidad && values.nuevaDireccionCP) {
        // Crear nueva dirección
        const nuevaDireccion = await addressAPI.createDireccion(token, {
          calle: values.nuevaDireccionCalle,
          localidad: values.nuevaDireccionLocalidad,
          cp: values.nuevaDireccionCP
        });
        
        // Crear la relación usuario-dirección
        const usuarioDireccion = await addressAPI.createUsuarioDireccion(token, {
          usuario: payload.usuario,
          direccion: nuevaDireccion
        });
        
        payload.usuarioDireccion = usuarioDireccion.id;
      }
      
      return !!(await orderAPI.createOrden(token, {
        usuario: payload.usuario,
        usuarioDireccion: payload.usuarioDireccion,
        detalles: payload.detalle,
        fecha: payload.fecha,
        precioTotal: payload.total,
        metodoPago: payload.metodoPago,
        estado: payload.estado,
      }));
    } catch (error) {
      console.error('Error creando orden:', error);
      throw error;
    }
  },
};

export const CreateButton: React.FC<Props> = ({ view, onClose, onCreated }) => {
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

  // Sincronizar estado de crearNuevaDireccion con el formulario
  useEffect(() => {
    if (view === "Addresses") {
      setCrearNuevaDireccion(false);
    }
  }, [view]);

  return (
    <Modal show={true} onHide={onClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Crear {view}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValuesMap[view]}
          validationSchema={schemaMap[view]}
          onSubmit={async (values) => {
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
                  // Crear la categoría con tipos vacíos por defecto
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
                
                // Procesar el payload para productos
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
                
                // Usar el payload procesado
                const handler = createHandlers[view];
                const ok = await handler(token, processedPayload);
                if (ok) {
                  onCreated?.();
                  onClose();
                } else {
                  Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el elemento.' });
                }
                return; // Salir temprano para productos
              }
              // Categories: crear nuevo tipo si corresponde
              if (view === "Categories" && crearNuevoTipo) {
                const nuevoTipo = await typeAPI.createTipo(token, { nombre: values.nuevoTipoNombre });
                payload.tipos = [...(payload.tipos || []), nuevoTipo.id];
              }
              // Types: nada especial, ya se maneja
              const handler = createHandlers[view];
              const ok = await handler(token, payload);
              if (ok) {
                // Refrescar tipos tras crear uno nuevo
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
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Row>
                {view === "Addresses" && (
                  <div className={style.Input}>
                    <label>
                      <input
                        type="checkbox"
                        checked={crearNuevaDireccion}
                        onChange={(e) => {
                          setCrearNuevaDireccion(e.target.checked);
                          setFieldValue("crearNuevaDireccion", e.target.checked);
                        }}
                      />
                      Crear nueva dirección
                    </label>
                  </div>
                )}
                {Object.keys(initialValuesMap[view]).map((key) => {
                  // Omitir campos auxiliares que no deben mostrarse en el formulario
                  const camposAuxiliares = [
                    "crearNuevoUsuario",
                    "nuevoUsuarioNombre", 
                    "nuevoUsuarioEmail",
                    "nuevoUsuarioPassword",
                    "crearNuevaDireccion",
                    "nuevaDireccionCalle",
                    "nuevaDireccionLocalidad",
                    "nuevaDireccionCP",
                    "productoSeleccionado",
                    "cantidadProducto",
                    // Campos de dirección para Addresses
                    "calle",
                    "localidad", 
                    "cp"
                  ];
                  
                  // Excluir campos que tienen manejo personalizado
                  if (camposAuxiliares.includes(key)) {
                    return null;
                  }

                  // Excluir campos con manejo personalizado para Orders
                  if (view === "Orders" && (key === "detalle" || key === "total")) {
                    return null; // No renderizar estos campos en el bucle automático
                  }

                  // Manejar campos específicos para Addresses y Orders
                  if (view === "Addresses" || view === "Orders") {
                    if (key === "usuario") {
                      const opts: IUsuario[] = usuarios;

                      return (
                        <div className={style.Input}>
                          <label>
                            <b>Usuario</b>
                          </label>
                          <Field
                            as="select"
                            name="usuario.id"
                            className={style.Field}
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                              const selected = opts.find(
                                (o) => o.id === +e.target.value
                              );
                              if (selected) {
                                setFieldValue("usuario", selected);
                                // Limpiar la dirección seleccionada cuando se cambia el usuario
                                if (view === "Orders") {
                                  setFieldValue("usuarioDireccion", null);
                                }
                              }
                            }}
                          >
                            <option value="">-- Seleccionar --</option>
                            {opts.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.nombre}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="usuario.id"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      );
                    }

                    if (key === "usuarioDireccion") {
                      // Filtrar direcciones por usuario seleccionado
                      const usuarioSeleccionado = values.usuario?.id;
                      const direccionesDelUsuario = usuarioSeleccionado 
                        ? direcciones.filter(d => d.usuario.id === usuarioSeleccionado)
                        : [];

                      return (
                        <React.Fragment key="usuarioDireccion-alternancia">
                          {usuarioSeleccionado && (
                            <div className={style.Input}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={crearNuevaDireccion}
                                  onChange={(e) => {
                                    setCrearNuevaDireccion(e.target.checked);
                                    setFieldValue("crearNuevaDireccion", e.target.checked);
                                  }}
                                />
                                Crear nueva dirección para este usuario
                              </label>
                            </div>
                          )}
                          
                          {crearNuevaDireccion && usuarioSeleccionado ? (
                            <>
                              <div className={style.Input}>
                                <label>Calle</label>
                                <Field name="nuevaDireccionCalle" className={style.Field} />
                                <ErrorMessage name="nuevaDireccionCalle" component="div" className="error-message" />
                              </div>
                              <div className={style.Input}>
                                <label>Localidad</label>
                                <Field name="nuevaDireccionLocalidad" className={style.Field} />
                                <ErrorMessage name="nuevaDireccionLocalidad" component="div" className="error-message" />
                              </div>
                              <div className={style.Input}>
                                <label>CP</label>
                                <Field name="nuevaDireccionCP" className={style.Field} />
                                <ErrorMessage name="nuevaDireccionCP" component="div" className="error-message" />
                              </div>
                            </>
                          ) : (
                            <div className={style.Input}>
                              <label>Dirección del usuario</label>
                              <Field
                                as="select"
                                name="usuarioDireccion.id"
                                className={style.Field}
                                value={values.usuarioDireccion?.id || ""}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                  const selected = direccionesDelUsuario.find((d) => d.id === +e.target.value);
                                  if (selected) setFieldValue("usuarioDireccion", selected);
                                }}
                              >
                                <option value="">-- Seleccionar dirección --</option>
                                {direccionesDelUsuario.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {`${d.direccion.calle}, ${d.direccion.localidad} (${d.direccion.cp})`}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="usuarioDireccion.id" component="div" className="error-message" />
                              {usuarioSeleccionado && direccionesDelUsuario.length === 0 && !crearNuevaDireccion && (
                                <div style={{ color: 'orange', fontSize: '12px', marginTop: '5px' }}>
                                  El usuario seleccionado no tiene direcciones registradas. 
                                  Puede crear una nueva dirección marcando la opción arriba.
                                </div>
                              )}
                              {!usuarioSeleccionado && (
                                <div style={{ color: 'blue', fontSize: '12px', marginTop: '5px' }}>
                                  Primero debe seleccionar un usuario para ver sus direcciones disponibles.
                                </div>
                              )}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    }
                  }

                  if (key === "direccion") {
                    // Manejar campo dirección para Addresses
                    if (view === "Addresses") {
                      if (crearNuevaDireccion) {
                        // Mostrar campos para nueva dirección
                        return (
                          <React.Fragment key="direccion-nueva">
                            <div className={style.Input}>
                              <label>Calle</label>
                              <Field name="calle" className={style.Field} />
                              <ErrorMessage name="calle" component="div" className="error-message" />
                            </div>
                            <div className={style.Input}>
                              <label>Localidad</label>
                              <Field name="localidad" className={style.Field} />
                              <ErrorMessage name="localidad" component="div" className="error-message" />
                            </div>
                            <div className={style.Input}>
                              <label>CP</label>
                              <Field name="cp" className={style.Field} />
                              <ErrorMessage name="cp" component="div" className="error-message" />
                            </div>
                          </React.Fragment>
                        );
                      } else {
                        // Selector de dirección existente
                        return (
                          <div className={style.Input} key={key}>
                            <label>Dirección existente</label>
                            <Field
                              as="select"
                              name="direccion.id"
                              className={style.Field}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selected = direcciones.find((d) => d.direccion.id === +e.target.value);
                                if (selected) setFieldValue("direccion", selected.direccion);
                              }}
                            >
                              <option value="">-- Seleccionar --</option>
                              {direcciones.map((d) => (
                                <option key={d.direccion.id} value={d.direccion.id}>
                                  {`${d.direccion.calle}, ${d.direccion.localidad} (${d.direccion.cp})`}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="direccion.id" component="div" className="error-message" />
                          </div>
                        );
                      }
                    }
                  }
                  // Usuario siempre se muestra
                  if (view === "Addresses" && key === "usuario") {
                    // Campo usuario manejado en la sección unificada de Addresses/Orders más abajo
                    return null;
                  }
                  // Otros campos normales
                  if (view === "Addresses" && (key === "calle" || key === "localidad" || key === "cp")) {
                    return null; // Ya se muestran arriba si corresponde
                  }
                  // Render selects según vista/key
                  if (view === "Products" && key === "categoria") {
                    return (
                      <React.Fragment key="categoria-alternancia">
                        <div className={style.Input}>
                          <label>
                            <input
                              type="checkbox"
                              checked={crearNuevaCategoria}
                              onChange={() => setCrearNuevaCategoria((v) => !v)}
                            />
                            Crear nueva categoría
                          </label>
                        </div>
                        {crearNuevaCategoria ? (
                          <div className={style.Input}>
                            <label>Nombre de la nueva categoría</label>
                            <Field name="nuevaCategoriaNombre" className={style.Field} />
                            <ErrorMessage name="nuevaCategoriaNombre" component="div" className="error-message" />
                          </div>
                        ) : (
                          <div className={style.Input}>
                            <label>
                              <b>Categoría</b>
                            </label>
                            <Field
                              as="select"
                              name="categoria.id"
                              className={style.Field}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const sel = categorias.find((c) => c.id === +e.target.value)!;
                                setFieldValue("categoria", sel);
                              }}
                            >
                              <option value="">-- Seleccionar --</option>
                              {categorias.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="categoria.id" component="div" className="error-message" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }

                  if (view === "Products" && key === "tipo") {
                    return (
                      <div key={key} className={style.Input}>
                        <label>
                          <b>Tipo</b>
                        </label>
                        <Field
                          as="select"
                          name="tipo.id"
                          className={style.Field}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const sel = tipos.find((t) => t.id === +e.target.value)!;
                            setFieldValue("tipo", sel);
                          }}
                        >
                          <option value="">-- Seleccionar --</option>
                          {tipos.map((t) => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="tipo.id" component="div" className="error-message" />
                      </div>
                    );
                  }

                  if (view === "Products" && key === "talles") {
                    return (
                      <React.Fragment key="talles-alternancia">
                        <div className={style.Input}>
                          <label>
                            <input
                              type="checkbox"
                              checked={crearNuevoTalle}
                              onChange={() => setCrearNuevoTalle((v) => !v)}
                            />
                            Crear nuevo talle
                          </label>
                        </div>
                        {crearNuevoTalle ? (
                          <>
                            <div className={style.Input}>
                              <label>Sistema</label>
                              <Field as="select" name="nuevoTalleSistema" className={style.Field}>
                                <option value="">-- Seleccionar --</option>
                                {Object.values(SistemaTalle).map((v) => (
                                  <option key={v} value={v}>{v}</option>
                                ))}
                              </Field>
                              <ErrorMessage name="nuevoTalleSistema" component="div" className="error-message" />
                            </div>
                            <div className={style.Input}>
                              <label>Valor</label>
                              <Field name="nuevoTalleValor" className={style.Field} />
                              <ErrorMessage name="nuevoTalleValor" component="div" className="error-message" />
                            </div>
                          </>
                        ) : (
                          <div className={style.Input}>
                            <label>
                              <b>Talles</b>
                            </label>
                            <Field
                              as="select"
                              multiple
                              name="talles"
                              className={style.Field}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const ids = Array.from(e.target.selectedOptions).map((o) => +o.value);
                                setFieldValue("talles", ids);
                              }}
                            >
                              {talles.map((t) => (
                                <option key={t.id} value={t.id}>{t.sistema} {t.valor}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="talles" component="div" className="error-message" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }

                  if (view === "Categories" && key === "tipos") {
                    return (
                      <React.Fragment key="tipos-alternancia">
                        <div className={style.Input}>
                          <label>
                            <b>Tipos</b>
                          </label>
                          <Field
                            as="select"
                            multiple
                            name="tipos"
                            className={style.Field}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const ids = Array.from(e.target.selectedOptions).map((o) => +o.value);
                              setFieldValue("tipos", ids);
                            }}
                          >
                            {tipos.map((t) => (
                              <option key={t.id} value={t.id}>{t.nombre}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="tipos" component="div" className="error-message" />
                        </div>
                      </React.Fragment>
                    );
                  }

                  if (view === "Types" && key === "categorias") {
                    return (
                      <div key={key} className={style.Input}>
                        <label>
                          <b>Categorías</b>
                        </label>
                        <Field
                          as="select"
                          multiple
                          name="categorias"
                          className={style.Field}
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            const ids = Array.from(
                              e.target.selectedOptions
                            ).map((o) => +o.value);
                            setFieldValue(
                              "categorias",
                              categorias
                                .filter(
                                  (c): c is ICategoria & { id: number } =>
                                    typeof c.id === "number"
                                )
                                .filter((c) => ids.includes(c.id))
                            );
                          }}
                        >
                          {categorias.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="categorias"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    );
                  }

                  // Campo usuario manejado en la sección unificada de Addresses/Orders más abajo
                  // Otros campos normales
                  // Campo genérico
                  const inputType = [
                    "cantidad",
                    "precio",
                    "total",
                    "cp",
                  ].includes(key)
                    ? "number"
                    : key === "fecha"
                    ? "date"
                    : "text";

                  // Para cantidad y precio, agrego min
                  if (view === "Products" && key === "cantidad") {
                    return (
                      <div key={key} className={style.Input}>
                        <label htmlFor={key}><b>{key}</b></label>
                        <Field
                          name={key}
                          type="number"
                          min={1}
                          className={style.Field}
                          placeholder={key}
                        />
                        <ErrorMessage
                          name={key}
                          component="div"
                          className="error-message visible"
                        />
                      </div>
                    );
                  }
                  if (view === "Products" && key === "precio") {
                    return (
                      <div key={key} className={style.Input}>
                        <label htmlFor={key}><b>{key}</b></label>
                        <Field
                          name={key}
                          type="number"
                          min={0.01}
                          step={0.01}
                          className={style.Field}
                          placeholder={key}
                        />
                        <ErrorMessage
                          name={key}
                          component="div"
                          className="error-message visible"
                        />
                      </div>
                    );
                  }

                  // Campos específicos para órdenes
                  if (view === "Orders" && key === "metodoPago") {
                    return (
                      <div key={key} className={style.Input}>
                        <label htmlFor={key}><b>Método de pago</b></label>
                        <Field as="select" name={key} className={style.Field}>
                          <option value="">-- Seleccionar --</option>
                          {Object.values(MetodoPago).map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={key}
                          component="div"
                          className="error-message visible"
                        />
                      </div>
                    );
                  }

                  if (view === "Orders" && key === "estado") {
                    return (
                      <div key={key} className={style.Input}>
                        <label htmlFor={key}><b>Estado</b></label>
                        <Field as="select" name={key} className={style.Field}>
                          <option value="">-- Seleccionar --</option>
                          {Object.values(EstadoOrden).map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={key}
                          component="div"
                          className="error-message visible"
                        />
                      </div>
                    );
                  }

                  // Campo específico para talles - sistema
                  if (view === "Sizes" && key === "sistema") {
                    return (
                      <div key={key} className={style.Input}>
                        <label htmlFor={key}><b>Sistema de talle</b></label>
                        <Field as="select" name={key} className={style.Field}>
                          <option value="">-- Seleccionar --</option>
                          {Object.values(SistemaTalle).map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={key}
                          component="div"
                          className="error-message visible"
                        />
                      </div>
                    );
                  }

                  if (view === "Orders" && key === "total") {
                    // Calcular el total automáticamente basado en los productos
                    const totalCalculado = values.detalle?.reduce((sum: number, item: any) => {
                      const producto = productos.find(p => p.id === item.producto.id);
                      return sum + (producto?.precio || 0) * item.cantidad;
                    }, 0) || 0;
                    
                    // Actualizar el total en el formulario
                    if (totalCalculado !== values.total) {
                      setFieldValue("total", totalCalculado);
                    }
                    
                    return (
                      <div key={key} className={style.Input}>
                        <label htmlFor={key}><b>Total</b></label>
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: '#f5f5f5', 
                          borderRadius: '5px',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          ${totalCalculado.toFixed(2)}
                        </div>
                      </div>
                    );
                  }

                  // Campo específico para imagen de producto
                  if (view === "Products" && key === "imagenPublicId") {
                    return (
                      <div key={key} className={style.Input}>
                        <ImageUpload
                          currentImagePublicId={values.imagenPublicId}
                          onImageUpload={async (file) => {
                            const publicId = await uploadImageToCloudinary(file);
                            setFieldValue("imagenPublicId", publicId);
                            return publicId;
                          }}
                          onImageRemove={() => {
                            setFieldValue("imagenPublicId", "");
                          }}
                          label="Imagen del producto"
                        />
                      </div>
                    );
                  }

                  // Campo específico para imagen de perfil de usuario
                  if (view === "Users" && key === "imagenPerfilPublicId") {
                    return (
                      <div className={style.Input}>
                        <ImageUpload
                          label="Imagen de perfil (opcional)"
                          currentImagePublicId={values.imagenPerfilPublicId || DEFAULT_IMAGE_PUBLIC_ID}
                          onImageUpload={async (file) => {
                            const publicId = await uploadImageToCloudinary(file, "usuarios");
                            setFieldValue("imagenPerfilPublicId", publicId);
                            return publicId;
                          }}
                          onImageRemove={() => setFieldValue("imagenPerfilPublicId", "")}
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={key} className={style.Input}>
                      <label htmlFor={key}>
                        <b>{key}</b>
                      </label>
                      <Field
                        name={key}
                        type={inputType}
                        className={style.Field}
                        placeholder={key}
                      />
                      <ErrorMessage
                        name={key}
                        component="div"
                        className="error-message visible"
                      />
                    </div>
                  );
                })}

                {view === "Orders" && (
                  <div className={style.Input}>
                    <label><b>Productos de la orden</b></label>
                    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                      {values.detalle && values.detalle.length > 0 ? (
                        values.detalle.map((item: any, index: number) => {
                          const producto = productos.find(p => p.id === item.producto.id);
                          const stockDisponible = producto?.cantidad || 0;
                          const cantidadEnOrden = item.cantidad;
                          const excedeStock = cantidadEnOrden > stockDisponible;
                          
                          return (
                            <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                  <strong>Producto:</strong> {producto?.nombre || 'Producto no encontrado'} | 
                                  <strong>Cantidad:</strong> {item.cantidad} | 
                                  <strong>Stock disponible:</strong> {stockDisponible}
                                  {excedeStock && (
                                    <span style={{ color: 'red', marginLeft: '10px' }}>
                                      ⚠️ Excede stock disponible
                                    </span>
                                  )}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newDetalle = values.detalle.filter((_: any, i: number) => i !== index);
                                    setFieldValue("detalle", newDetalle);
                                    // Recalcular total
                                    const nuevoTotal = newDetalle.reduce((sum: number, item: any) => {
                                      const producto = productos.find(p => p.id === item.producto.id);
                                      return sum + (producto?.precio || 0) * item.cantidad;
                                    }, 0);
                                    setFieldValue("total", nuevoTotal);
                                  }}
                                  style={{ background: 'red', color: 'white', border: 'none', borderRadius: '3px', padding: '2px 8px', cursor: 'pointer' }}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>No hay productos agregados</p>
                      )}
                      
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <Field
                            as="select"
                            name="productoSeleccionado"
                            style={{ flex: 1, padding: '5px' }}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const productoId = +e.target.value;
                              if (productoId) {
                                setFieldValue("productoSeleccionado", productoId);
                                // Reset cantidad cuando se selecciona un nuevo producto
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
                          <Field
                            name="cantidadProducto"
                            type="number"
                            min="1"
                            placeholder="Cantidad"
                            style={{ width: '100px', padding: '5px' }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const cantidad = parseInt(e.target.value) || 0;
                              const productoId = values.productoSeleccionado;
                              const producto = productos.find(p => p.id === productoId);
                              const stockDisponible = producto?.cantidad || 0;
                              
                              // Validar que no exceda el stock
                              if (cantidad > stockDisponible) {
                                e.target.setCustomValidity(`La cantidad no puede exceder el stock disponible (${stockDisponible})`);
                              } else {
                                e.target.setCustomValidity('');
                              }
                              
                              setFieldValue("cantidadProducto", cantidad);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const productoId = values.productoSeleccionado;
                              const cantidad = values.cantidadProducto;
                              const producto = productos.find(p => p.id === productoId);
                              const stockDisponible = producto?.cantidad || 0;
                              
                              if (productoId && cantidad && cantidad > 0 && cantidad <= stockDisponible) {
                                // Verificar que no se agregue el mismo producto dos veces
                                const productoYaAgregado = values.detalle?.some((item: any) => item.producto.id === productoId);
                                if (productoYaAgregado) {
                                  Swal.fire({
                                    icon: 'warning',
                                    title: 'Producto ya agregado',
                                    text: 'Este producto ya está en la orden. Puede modificar la cantidad eliminándolo y agregándolo nuevamente.',
                                  });
                                  return;
                                }
                                
                                const newDetalle = [...(values.detalle || []), { producto: { id: productoId }, cantidad }];
                                setFieldValue("detalle", newDetalle);
                                setFieldValue("productoSeleccionado", "");
                                setFieldValue("cantidadProducto", 1);
                                
                                // Recalcular total
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
                            style={{ background: 'green', color: 'white', border: 'none', borderRadius: '3px', padding: '5px 10px', cursor: 'pointer' }}
                          >
                            Agregar
                          </button>
                        </div>
                        {values.productoSeleccionado && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Stock disponible: {productos.find(p => p.id === values.productoSeleccionado)?.cantidad || 0} unidades
                          </div>
                        )}
                      </div>
                    </div>
                    <ErrorMessage name="detalle" component="div" className="error-message" />
                  </div>
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