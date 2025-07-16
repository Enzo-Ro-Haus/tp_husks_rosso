import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import style from './EditButton.module.css';
import { usuarioStore } from '../../../../store/usuarioStore';
import { ordenStore } from '../../../../store/ordenStore';
import { tipoStore } from '../../../../store/tipoStore';
import { categoriaStore } from '../../../../store/categoriaStore';

import * as userAPI from '../../../../http/usuarioHTTP';
import * as productAPI from '../../../../http/productoHTTP';
import * as categoryAPI from '../../../../http/categoriaHTTP';
import * as typeAPI from '../../../../http/tipoHTTP';
import * as sizeAPI from '../../../../http/talleHTTP';
import * as addressAPI from '../../../../http/direccionHTTP';
import * as orderAPI from '../../../../http/ordenHTTPS';
import { uploadImageToCloudinary } from '../../../../http/cloudinaryUploadHTTP';
import ImageUpload from '../../Image/ImageUpload';

import { IOrden } from '../../../../types/IOrden';
import { ICategoria } from '../../../../types/ICategoria';
import { ITipo } from '../../../../types/ITipo';
import { IDireccion } from '../../../../types/IDireccion';
import { IUsuario } from '../../../../types/IUsuario';
import { IUsuarioDireccion } from '../../../../types/IUsuarioDireccion';
import { IProducto } from '../../../../types/IProducto';
import { Rol } from '../../../../types/enums/Rol';
import { MetodoPago } from '../../../../types/enums/MetodoPago';
import { EstadoOrden } from '../../../../types/enums/EstadoOrden';
import Swal from 'sweetalert2';
import { SistemaTalle } from '../../../../types/enums/SistemaTalle';

// Define possible views
type ViewType =
  | 'Users'
  | 'Products'
  | 'Categories'
  | 'Types'
  | 'Sizes'
  | 'Addresses'
  | 'Orders'
  | 'Client';

interface EditButtonProps {
  view: ViewType;
  initialData: any;
  onClose: () => void;
  onEdited?: () => void;
}

// Validation schemas per view
const schemaMap: Record<ViewType, yup.ObjectSchema<any>> = {
  Users: yup.object({
    nombre: yup.string().required('❌ Obligatorio'),
    email: yup.string().email().required('❌ Obligatorio'),
    password: yup.string().min(6),
    rol: yup.string().required('❌ Obligatorio'),
    imagenPerfilPublicId: yup.string().optional(),
  }),
  Products: yup.object({
    nombre: yup.string().required(),
    cantidad: yup.number().min(1).required(),
    precio: yup.number().min(0.01).required(),
    color: yup.string().required(),
    tallesDisponibles: yup.array().of(yup.object({ id: yup.number().required() })).min(1).required(),
    categoria: yup.object({ id: yup.number().required(), nombre: yup.string().required() }).required(),
    tipo: yup.object({ id: yup.number().required(), nombre: yup.string().required() }).required(),
    descripcion: yup.string().required(),
    imagenPublicId: yup.string().optional(),
  }),
  Categories: yup.object({
    nombre: yup.string().required(),
    tipos: yup.array().of(yup.object({ id: yup.number().required(), nombre: yup.string().required() })).min(1, 'Debe seleccionar al menos un tipo'),
  }),
  Types: yup.object({ nombre: yup.string().required() }),
  Sizes: yup.object({ sistema: yup.string().required(), valor: yup.string().required() }),
  Addresses: yup.object({ calle: yup.string().required(), localidad: yup.string().required(), cp: yup.string().required() }),
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
  Client: yup.object({ nombre: yup.string().required(), email: yup.string().email().required(), password: yup.string().min(6) }),
};

// Handlers to call update endpoints
const editHandlers: Record<ViewType, (token: string, id: number, values: any) => Promise<boolean>> = {
  Users: async (token, id, values) => {
    const updated = await userAPI.updateUsuario(token, id, values);
    usuarioStore.getState().editarUnUsuario(updated);
    return !!updated;
  },
  Products: async (token, id, values) => !!(await productAPI.updateProducto(token, id, values)),
  Categories: async (token, id, values) => {
    const updated = await categoryAPI.updateCategoria(token, id, values);
    categoriaStore.getState().editarUnaCategoria(updated);
    return !!updated;
  },
  Types: async (token, id, values) => {
    const updated = await typeAPI.updateTipo(token, id, values);
    tipoStore.getState().editarUnTipo(updated);
    return !!updated;
  },
  Sizes: async (token, id, values) => !!(await sizeAPI.updateTalle(token, id, values)),
  Addresses: async (token, id, values) => !!(await addressAPI.updateDireccion(token, id, values)),
  Orders: async (token, id, values) => {
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
      
      // Asegurar que el payload tenga todos los campos necesarios
      const ordenPayload = {
        id: id, // Incluir el ID de la orden
        usuario: payload.usuario,
        usuarioDireccion: payload.usuarioDireccion,
        fecha: payload.fecha, // La fecha ya está en formato YYYY-MM-DD
        precioTotal: payload.total,
        metodoPago: payload.metodoPago,
        estado: payload.estado,
        detalles: payload.detalle || payload.detalles || [],
        activo: true // Incluir el campo activo de Base
      };
      
      console.log('Payload enviado:', JSON.stringify(ordenPayload, null, 2)); // Debug
      
      return !!(await orderAPI.updateOrden(token, id, ordenPayload));
    } catch (error) {
      console.error('Error actualizando orden:', error);
      throw error;
    }
  },
  Client: async (token, id, values) => !!(await userAPI.updateUsuario(token, id, values)),
};

const DEFAULT_IMAGE_PUBLIC_ID = "user_img";

export const EditButton: React.FC<EditButtonProps> = ({ view, initialData, onClose, onEdited }) => {
  const token = usuarioStore(s => s.usuarioActivo?.token) || '';
  const [open, setOpen] = useState(false);

  // Obtener ordenActiva del store cuando view === 'Orders'
  const ordenActiva = ordenStore(s => s.ordenActiva);
  const setOrdenActiva = ordenStore(s => s.setOrdenActiva);

  // Related entities
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [talles, setTalles] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [direcciones, setDirecciones] = useState<IUsuarioDireccion[]>([]);
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [crearNuevoUsuario, setCrearNuevoUsuario] = useState(false);
  const [crearNuevaDireccion, setCrearNuevaDireccion] = useState(false);
  const [ordenCompleta, setOrdenCompleta] = useState<IOrden | null>(null);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      if (view === 'Products') {
        setCategorias(await categoryAPI.getAllCategorias(token) || []);
        setTalles(await sizeAPI.getAllTalles(token) || []);
        setTipos(await typeAPI.getAllTipos(token) || []);
      }
      if (view === 'Categories') {
        setTipos(await typeAPI.getAllTipos(token) || []);
      }
      if (view === 'Addresses' || view === 'Orders') {
        setUsuarios(await userAPI.getAllUsuarios(token) || []);
        setDirecciones(await addressAPI.getAllUsuarioDirecciones(token) || []);
      }
      if (view === 'Orders') {
        setProductos(await productAPI.getAllProductos(token) || []);
        // Cargar la orden completa si tenemos el ID
        if (initialData?.id) {
          try {
            const orden = await orderAPI.getOrdenById(token, initialData.id);
            setOrdenCompleta(orden);
          } catch (error) {
            console.error('Error cargando orden:', error);
          }
        }
      }
      if (view === 'Sizes') {
        setProductos(await productAPI.getAllProductos(token) || []);
      }
      if (view === 'Types') {
        setCategorias(await categoryAPI.getAllCategorias(token) || []);
        setProductos(await productAPI.getAllProductos(token) || []);
      }
    };
    load();
  }, [open, view, token, initialData?.id]);

  const handleOpen = () => {
    // Si es Orders, establecer la orden activa en el store
    if (view === 'Orders') {
      setOrdenActiva(initialData);
    }
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); onClose(); };

  const handleSubmit = async (values: any) => {
    if (view === 'Users') {
      const payload = {
        nombre: values.nombre,
        email: values.email,
        ...(values.password ? { password: values.password } : {}),
        imagenPerfilPublicId: values.imagenPerfilPublicId || initialData.imagenPerfilPublicId || DEFAULT_IMAGE_PUBLIC_ID,
      };
      console.log('Payload usuario a enviar:', payload);
      const ok = await userAPI.updateUsuario(token, initialData.id, payload);
      if (ok) {
        onEdited?.();
        handleClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo editar el usuario.' });
      }
      return;
    }
    if (!token) return;
    const handler = editHandlers[view];
    // Usar el ID de ordenActiva para Orders, o initialData.id para otros views
    const entityId = view === 'Orders' ? ordenActiva?.id : initialData.id;
    
    // Limpiar el payload para Addresses para que solo envíe campos relevantes
    let cleanedValues = values;
    if (view === 'Addresses') {
      cleanedValues = {
        calle: values.calle,
        localidad: values.localidad,
        cp: values.cp,
        activo: values.activo
      };
      console.log('Payload limpio para Addresses:', cleanedValues);
    }
    
    // Limpiar el payload para Sizes para que solo envíe campos relevantes
    if (view === 'Sizes') {
      cleanedValues = {
        sistema: values.sistema,
        valor: values.valor,
        activo: values.activo
      };
      console.log('Payload limpio para Sizes:', cleanedValues);
    }
    
    // Limpiar el payload para Types para que solo envíe campos relevantes
    if (view === 'Types') {
      cleanedValues = {
        nombre: values.nombre,
        activo: values.activo
      };
      console.log('Payload limpio para Types:', cleanedValues);
    }
    
    // Limpiar el payload para Categories para que solo envíe campos relevantes
    if (view === 'Categories') {
      cleanedValues = {
        nombre: values.nombre,
        tipos: values.tipos,
        activo: values.activo
      };
      console.log('Payload limpio para Categories:', cleanedValues);
    }
    
    // Limpiar el payload para Products para que solo envíe campos relevantes
    if (view === 'Products') {
      cleanedValues = {
        nombre: values.nombre,
        cantidad: values.cantidad,
        precio: values.precio,
        color: values.color,
        tallesDisponibles: values.tallesDisponibles,
        categoria: values.categoria,
        tipo: values.tipo,
        descripcion: values.descripcion,
        activo: values.activo
      };
      console.log('Payload limpio para Products:', cleanedValues);
    }
    
    const success = handler ? await handler(token, entityId, cleanedValues) : false;
    if (success && onEdited) onEdited();
    if (success) handleClose();
  };

  // Usar ordenCompleta si está disponible, sino ordenActiva del store para Orders, o initialData para otros views
  const dataSource = view === 'Orders' ? (ordenCompleta || ordenActiva) : initialData;

  // Función para formatear fecha a formato YYYY-MM-DD para input date
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Justo antes de pasar dataSource a Formik, normalizo los campos para asegurar que fecha, metodoPago, estado y detalle existan.
  const normalizedInitialData = {
    ...dataSource,
    // Solo agregar campos específicos de órdenes si estamos editando una orden
    ...(view === 'Orders' ? {
      fecha: dataSource?.fecha ? formatDateForInput(dataSource.fecha) : '',
      metodoPago: dataSource?.metodoPago || '',
      estado: dataSource?.estado || '',
      detalle: dataSource?.detalle || dataSource?.detalles || [],
      total: dataSource?.precioTotal || dataSource?.total || 0,
    } : {})
  };

  // Debug para usuarios
  if (view === 'Users') {
    console.log('EditButton - initialData para usuario:', initialData);
    console.log('EditButton - dataSource para usuario:', dataSource);
    console.log('EditButton - normalizedInitialData para usuario:', normalizedInitialData);
  }

  // Para Addresses, extraer los datos de la dirección desde la estructura anidada
  if (view === 'Addresses') {
    // Si los datos vienen de usuarioDireccion.direccion, extraerlos
    if (dataSource?.usuarioDireccion?.direccion) {
      normalizedInitialData.calle = dataSource.usuarioDireccion.direccion.calle;
      normalizedInitialData.localidad = dataSource.usuarioDireccion.direccion.localidad;
      normalizedInitialData.cp = dataSource.usuarioDireccion.direccion.cp;
      normalizedInitialData.id = dataSource.usuarioDireccion.direccion.id;
    }
    // Si los datos vienen directamente de la dirección
    else if (dataSource?.calle) {
      normalizedInitialData.calle = dataSource.calle;
      normalizedInitialData.localidad = dataSource.localidad;
      normalizedInitialData.cp = dataSource.cp;
      normalizedInitialData.id = dataSource.id;
    }
    // Si los datos vienen de street, locality, pc (nombres alternativos)
    else if (dataSource?.street) {
      normalizedInitialData.calle = dataSource.street;
      normalizedInitialData.localidad = dataSource.locality;
      normalizedInitialData.cp = dataSource.pc;
      normalizedInitialData.id = dataSource.id;
    }
  }

  // Para Sizes, extraer los datos del talle desde la estructura anidada
  if (view === 'Sizes') {
    // Si los datos vienen directamente del talle
    if (dataSource?.sistema) {
      normalizedInitialData.sistema = dataSource.sistema;
      normalizedInitialData.valor = dataSource.valor;
      normalizedInitialData.id = dataSource.id;
    }
    // Si los datos vienen de system, value (nombres alternativos)
    else if (dataSource?.system) {
      normalizedInitialData.sistema = dataSource.system;
      normalizedInitialData.valor = dataSource.value;
      normalizedInitialData.id = dataSource.id;
    }
  }

  // Para Types, extraer los datos del tipo desde la estructura anidada
  if (view === 'Types') {
    // Si los datos vienen directamente del tipo
    if (dataSource?.nombre) {
      normalizedInitialData.nombre = dataSource.nombre;
      normalizedInitialData.id = dataSource.id;
    }
    // Si los datos vienen de name (nombre alternativo)
    else if (dataSource?.name) {
      normalizedInitialData.nombre = dataSource.name;
      normalizedInitialData.id = dataSource.id;
    }
  }

  // Para Categories, asegurar que el nombre esté correctamente asignado
  if (view === 'Categories') {
    if (dataSource?.nombre) {
      normalizedInitialData.nombre = dataSource.nombre;
      normalizedInitialData.id = dataSource.id;
    } else if (dataSource?.name) {
      normalizedInitialData.nombre = dataSource.name;
      normalizedInitialData.id = dataSource.id;
    }
    // Asegurar que los tipos se normalicen correctamente
    if (dataSource?.tipos) {
      normalizedInitialData.tipos = dataSource.tipos;
    } else {
      normalizedInitialData.tipos = [];
    }
    
    // Debug para Categories
    console.log('dataSource Categories:', dataSource);
    console.log('normalizedInitialData Categories:', normalizedInitialData);
  }

  // Para Users, asegurar que todos los campos estén correctamente asignados
  if (view === 'Users') {
    if (dataSource?.nombre) {
      normalizedInitialData.nombre = dataSource.nombre;
    } else if (dataSource?.name) {
      normalizedInitialData.nombre = dataSource.name;
    }
    if (dataSource?.email) {
      normalizedInitialData.email = dataSource.email;
    }
    if (dataSource?.rol) {
      normalizedInitialData.rol = dataSource.rol;
    }
    if (dataSource?.imagenPerfilPublicId) {
      normalizedInitialData.imagenPerfilPublicId = dataSource.imagenPerfilPublicId;
    }
    // Password se deja vacío por seguridad
    normalizedInitialData.password = '';
    // Mantener las relaciones
    normalizedInitialData.direcciones = dataSource?.direcciones || [];
    normalizedInitialData.ordenes = dataSource?.ordenes || [];
    normalizedInitialData.id = dataSource?.id;

    // Debug para Users
    console.log('dataSource Users:', dataSource);
    console.log('normalizedInitialData Users:', normalizedInitialData);
    console.log('Campos específicos:', {
      nombre: normalizedInitialData.nombre,
      email: normalizedInitialData.email,
      rol: normalizedInitialData.rol,
      imagenPerfilPublicId: normalizedInitialData.imagenPerfilPublicId,
      direcciones: normalizedInitialData.direcciones,
      ordenes: normalizedInitialData.ordenes
    });
    console.log('Nombre del usuario a editar:', normalizedInitialData.nombre);
  }

  // Para Products, asegurar que todos los campos estén correctamente asignados
  if (view === 'Products') {
    if (dataSource?.nombre) {
      normalizedInitialData.nombre = dataSource.nombre;
    } else if (dataSource?.name) {
      normalizedInitialData.nombre = dataSource.name;
    }
    if (dataSource?.descripcion) {
      normalizedInitialData.descripcion = dataSource.descripcion;
    }
    if (dataSource?.color) {
      normalizedInitialData.color = dataSource.color;
    }
    if (dataSource?.precio) {
      normalizedInitialData.precio = dataSource.precio;
    }
    if (dataSource?.cantidad) {
      normalizedInitialData.cantidad = dataSource.cantidad;
    }
    if (dataSource?.categoria) {
      normalizedInitialData.categoria = dataSource.categoria;
    }
    if (dataSource?.tipo) {
      normalizedInitialData.tipo = dataSource.tipo;
    }
    if (dataSource?.tallesDisponibles) {
      normalizedInitialData.tallesDisponibles = dataSource.tallesDisponibles;
    } else if (dataSource?.sizes) {
      normalizedInitialData.tallesDisponibles = dataSource.sizes;
    }
    normalizedInitialData.id = dataSource?.id;

    // Debug para Products
    console.log('dataSource Products:', dataSource);
    console.log('normalizedInitialData Products:', normalizedInitialData);
    console.log('Campos específicos de producto:', {
      nombre: normalizedInitialData.nombre,
      descripcion: normalizedInitialData.descripcion,
      color: normalizedInitialData.color,
      precio: normalizedInitialData.precio,
      cantidad: normalizedInitialData.cantidad,
      categoria: normalizedInitialData.categoria,
      tipo: normalizedInitialData.tipo,
      tallesDisponibles: normalizedInitialData.tallesDisponibles
    });
    
    // Debug para verificar si hay campos incorrectos
    console.log('Todos los campos en normalizedInitialData para Products:', Object.keys(normalizedInitialData));
    console.log('¿Hay campos de órdenes?', {
      tieneFecha: 'fecha' in normalizedInitialData,
      tieneMetodoPago: 'metodoPago' in normalizedInitialData,
      tieneEstado: 'estado' in normalizedInitialData,
      tieneDetalle: 'detalle' in normalizedInitialData,
      tieneTotal: 'total' in normalizedInitialData
    });
  }

  // Debug para Addresses
  if (view === 'Addresses') {
    console.log('dataSource:', dataSource);
    console.log('normalizedInitialData:', normalizedInitialData);
  }

  // Debug para Sizes
  if (view === 'Sizes') {
    console.log('dataSource Sizes:', dataSource);
    console.log('normalizedInitialData Sizes:', normalizedInitialData);
  }

  // Debug para Types
  if (view === 'Types') {
    console.log('dataSource Types:', dataSource);
    console.log('normalizedInitialData Types:', normalizedInitialData);
  }

  return (
    <>
      <button className={style.editButton} onClick={handleOpen}>Edit</button>
      {open && (
        <div className={style.popup}>
          <div className={style.popupContent}>
            <h2>Editar {view}</h2>
            <Formik
              initialValues={normalizedInitialData}
              enableReinitialize
              validationSchema={schemaMap[view as ViewType]}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                // Recalcular total automáticamente cuando cambien los detalles
                React.useEffect(() => {
                  if (view === 'Orders' && values.detalle) {
                    const nuevoTotal = values.detalle.reduce((sum: number, item: any) => {
                      const producto = productos.find(p => p.id === item.producto.id);
                      return sum + (producto?.precio || 0) * item.cantidad;
                    }, 0);
                    setFieldValue("total", nuevoTotal);
                  }
                }, [values.detalle, productos, view, setFieldValue]);

                // Debug para Users - verificar valores iniciales
                React.useEffect(() => {
                  if (view === 'Users') {
                    console.log('Formik values para Users:', values);
                  }
                }, [values, view]);

                // Debug para Products - verificar valores iniciales
                React.useEffect(() => {
                  if (view === 'Products') {
                    console.log('Formik values para Products:', values);
                    console.log('Valores específicos del producto:', {
                      nombre: values.nombre,
                      descripcion: values.descripcion,
                      color: values.color,
                      precio: values.precio,
                      cantidad: values.cantidad,
                      categoria: values.categoria,
                      tipo: values.tipo,
                      tallesDisponibles: values.tallesDisponibles
                    });
                  }
                }, [values, view]);

                return (
                  <Form className={style.Form}>
                    <div className={style.containerInput}>
                      {view === 'Orders' ? (
                        // Lógica específica para órdenes
                        <>
                          {/* Sección de Usuario */}
                          <div className={style.Input}>
                            <label><b>Usuario</b></label>
                            <Field
                              as="select"
                              name="usuario.id"
                              className={style.Field}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selected = usuarios.find((u) => u.id === +e.target.value);
                                if (selected) {
                                  setFieldValue("usuario", selected);
                                  setFieldValue("usuarioDireccion", null);
                                }
                              }}
                            >
                              <option value="">-- Seleccionar --</option>
                              {usuarios.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.nombre}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="usuario.id" component="div" className="error-message" />
                          </div>

                          {/* Sección de Dirección */}
                          {values.usuario?.id && (
                            <div className={style.Input}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={crearNuevaDireccion}
                                  onChange={() => setCrearNuevaDireccion((v) => !v)}
                                />
                                Crear nueva dirección para este usuario
                              </label>
                              {crearNuevaDireccion ? (
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
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                      const direccionesDelUsuario = direcciones.filter(d => d.usuario.id === values.usuario?.id);
                                      const selected = direccionesDelUsuario.find((d) => d.id === +e.target.value);
                                      if (selected) setFieldValue("usuarioDireccion", selected);
                                    }}
                                  >
                                    <option value="">-- Seleccionar dirección --</option>
                                    {direcciones
                                      .filter(d => d.usuario.id === values.usuario?.id)
                                      .map((d) => (
                                        <option key={d.id} value={d.id}>
                                          {`${d.direccion.calle}, ${d.direccion.localidad} (${d.direccion.cp})`}
                                        </option>
                                      ))}
                                  </Field>
                                  <ErrorMessage name="usuarioDireccion.id" component="div" className="error-message" />
                                  {!values.usuario?.id && (
                                    <div style={{ color: 'blue', fontSize: '12px', marginTop: '5px' }}>
                                      Primero debe seleccionar un usuario para ver sus direcciones disponibles.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Campos básicos de la orden */}
                          <div className={style.Input}>
                            <label><b>Fecha</b></label>
                            <Field name="fecha" type="date" className={style.Field} />
                            <ErrorMessage name="fecha" component="div" className="error-message" />
                          </div>

                          <div className={style.Input}>
                            <label><b>Método de pago</b></label>
                            <Field as="select" name="metodoPago" className={style.Field}>
                              <option value="">-- Seleccionar --</option>
                              {Object.values(MetodoPago).map((v) => (
                                <option key={v} value={v}>
                                  {v}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="metodoPago" component="div" className="error-message" />
                          </div>

                          <div className={style.Input}>
                            <label><b>Estado</b></label>
                            <Field as="select" name="estado" className={style.Field}>
                              <option value="">-- Seleccionar --</option>
                              {Object.values(EstadoOrden).map((v) => (
                                <option key={v} value={v}>
                                  {v}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="estado" component="div" className="error-message" />
                          </div>

                          {/* Sección de Productos */}
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

                          {/* Total calculado automáticamente */}
                          <div className={style.Input}>
                            <label><b>Total</b></label>
                            <div style={{ 
                              padding: '10px', 
                              backgroundColor: '#f5f5f5', 
                              borderRadius: '5px',
                              fontWeight: 'bold',
                              fontSize: '16px'
                            }}>
                              ${(values.total || 0).toFixed(2)}
                            </div>
                          </div>
                        </>
                      ) : view === 'Addresses' ? (
                        // Campos específicos para Addresses
                        <>
                          <div className={style.Input}>
                            <label><b>Calle</b></label>
                            <Field
                              className={style.Field}
                              name="calle"
                              type="text"
                            />
                            <ErrorMessage name="calle" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Localidad</b></label>
                            <Field
                              className={style.Field}
                              name="localidad"
                              type="text"
                            />
                            <ErrorMessage name="localidad" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>CP</b></label>
                            <Field
                              className={style.Field}
                              name="cp"
                              type="text"
                            />
                            <ErrorMessage name="cp" component="div" className="error-message" />
                          </div>
                        </>
                      ) : view === 'Sizes' ? (
                        // Campos específicos para Sizes
                        <>
                          <div className={style.Input}>
                            <label><b>Sistema</b></label>
                            <Field as="select" className={style.Field} name="sistema">
                              <option value="">-- Seleccionar --</option>
                              {Object.values(SistemaTalle).map((v) => (
                                <option key={v} value={v}>{v}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="sistema" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Valor</b></label>
                            <Field
                              className={style.Field}
                              name="valor"
                              type="text"
                            />
                            <ErrorMessage name="valor" component="div" className="error-message" />
                          </div>
                          {/* Mostrar productos que utilizan este talle */}
                          <div className={style.Input}>
                            <label><b>Productos que utilizan este talle</b></label>
                            <div style={{ 
                              border: '1px solid #ccc', 
                              padding: '10px', 
                              borderRadius: '5px',
                              maxHeight: '200px',
                              overflowY: 'auto'
                            }}>
                              {(() => {
                                const talleId = normalizedInitialData.id;
                                if (!talleId) return null;
                                const productosDelTalle = productos.filter(p => 
                                  p.tallesDisponibles?.some(t => t.id === talleId)
                                );
                                
                                return productosDelTalle.length > 0 ? (
                                  productosDelTalle.map((producto) => (
                                    <div key={producto.id} style={{ 
                                      padding: '5px', 
                                      borderBottom: '1px solid #eee',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                    }}>
                                      <span><strong>{producto.nombre}</strong></span>
                                      <span style={{ color: '#666', fontSize: '0.9em' }}>
                                        ${producto.precio} - Stock: {producto.cantidad}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                                    Ningún producto utiliza este talle actualmente.
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </>
                      ) : view === 'Categories' ? (
                        // Campos específicos para Categories
                        <>
                          <div className={style.Input}>
                            <label><b>Nombre</b></label>
                            <Field
                              className={style.Field}
                              name="nombre"
                              type="text"
                            />
                            <ErrorMessage name="nombre" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Tipos</b></label>
                            <select
                              multiple
                              className={style.Field}
                              value={(values.tipos || []).map((t: any) => t.id.toString())}
                              onChange={e => {
                                const ids = Array.from(e.target.selectedOptions).map(o => +o.value);
                                setFieldValue('tipos', tipos.filter(t => t.id && ids.includes(t.id)));
                              }}
                            >
                              {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                            </select>
                            <ErrorMessage name="tipos" component="div" className="error-message" />
                            <div className="form-text">Puedes dejar vacío si la categoría no tiene tipos.</div>
                          </div>
                          <div className={style.Input}>
                            <label><b>Productos vinculados a esta categoría</b></label>
                            <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                              {normalizedInitialData.id && productos.filter(p => p.categoria?.id === normalizedInitialData.id).length > 0 ? (
                                productos.filter(p => p.categoria?.id === normalizedInitialData.id).map(producto => (
                                  <div key={producto.id} style={{ padding: '5px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span><strong>{producto.nombre}</strong></span>
                                    <span style={{ color: '#666', fontSize: '0.9em' }}>
                                      ${producto.precio} - Stock: {producto.cantidad}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div style={{ color: '#666', fontStyle: 'italic' }}>
                                  No hay productos vinculados a esta categoría actualmente.
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : view === 'Types' ? (
                        // Campos específicos para Types
                        <>
                          <div className={style.Input}>
                            <label><b>Nombre</b></label>
                            <Field
                              className={style.Field}
                              name="nombre"
                              type="text"
                            />
                            <ErrorMessage name="nombre" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Categorías asociadas a este tipo</b></label>
                            <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                              {categorias.filter(c => c.tipos?.some(t => t.id === normalizedInitialData.id)).length > 0 ? (
                                categorias.filter(c => c.tipos?.some(t => t.id === normalizedInitialData.id)).map(categoria => (
                                  <div key={categoria.id} style={{ padding: '5px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span><strong>{categoria.nombre}</strong></span>
                                    <span style={{ color: '#666', fontSize: '0.9em' }}>
                                      {categoria.productos?.length || 0} productos
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div style={{ color: '#666', fontStyle: 'italic' }}>
                                  No hay categorías asociadas a este tipo actualmente.
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : view === 'Products' ? (
                        // Campos específicos para productos
                        <>
                          <div className={style.Input}>
                            <label><b>Nombre</b></label>
                            <Field
                              className={style.Field}
                              name="nombre"
                              type="text"
                            />
                            <ErrorMessage name="nombre" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Descripción</b></label>
                            <Field
                              as="textarea"
                              className={style.Field}
                              name="descripcion"
                              rows={3}
                            />
                            <ErrorMessage name="descripcion" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Color</b></label>
                            <Field
                              className={style.Field}
                              name="color"
                              type="text"
                            />
                            <ErrorMessage name="color" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Precio</b></label>
                            <Field
                              className={style.Field}
                              name="precio"
                              type="number"
                              step="0.01"
                              min="0"
                            />
                            <ErrorMessage name="precio" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Cantidad (Stock)</b></label>
                            <Field
                              className={style.Field}
                              name="cantidad"
                              type="number"
                              min="0"
                            />
                            <ErrorMessage name="cantidad" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Categoría</b></label>
                            <select
                              className={style.Field}
                              value={values.categoria?.id || ''}
                              onChange={e => {
                                const sel = categorias.find(c => c.id === +e.target.value)!;
                                setFieldValue('categoria', sel);
                              }}
                            >
                              <option value="">Seleccione categoría</option>
                              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                            <ErrorMessage name="categoria" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Tipo</b></label>
                            <select
                              className={style.Field}
                              value={values.tipo?.id || ''}
                              onChange={e => {
                                const sel = tipos.find(t => t.id === +e.target.value)!;
                                setFieldValue('tipo', sel);
                              }}
                            >
                              <option value="">Seleccione tipo</option>
                              {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                            </select>
                            <ErrorMessage name="tipo" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Talles Disponibles</b></label>
                            <select
                              multiple
                              className={style.Field}
                              value={(values.tallesDisponibles || []).map((t: any) => t.id.toString())}
                              onChange={e => {
                                const ids = Array.from(e.target.selectedOptions).map(o => +o.value);
                                setFieldValue('tallesDisponibles', talles.filter(t => ids.includes(t.id)));
                              }}
                            >
                              {talles.map(t => <option key={t.id} value={t.id}>{t.sistema} {t.valor}</option>)}
                            </select>
                            <ErrorMessage name="tallesDisponibles" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <ImageUpload
                              label="Imagen del producto"
                              currentImagePublicId={values.imagenPublicId}
                              onImageUpload={async (file) => {
                                const publicId = await uploadImageToCloudinary(file);
                                setFieldValue("imagenPublicId", publicId);
                                return publicId;
                              }}
                              onImageRemove={() => {
                                setFieldValue("imagenPublicId", "");
                              }}
                            />
                          </div>
                        </>
                      ) : view === 'Users' ? (
                        // Campos específicos para usuarios
                        <>
                          <div className={style.Input}>
                            <label><b>Nombre</b></label>
                            <Field
                              className={style.Field}
                              name="nombre"
                              type="text"
                            />
                            <ErrorMessage name="nombre" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <label><b>Email</b></label>
                            <Field
                              className={style.Field}
                              name="email"
                              type="email"
                            />
                            <ErrorMessage name="email" component="div" className="error-message" />
                          </div>
                          {/* Solo mostrar campo de rol si NO es un usuario admin */}
                          {normalizedInitialData.rol !== 'ADMIN' && (
                            <div className={style.Input}>
                              <label><b>Rol</b></label>
                              <Field as="select" className={style.Field} name="rol">
                                <option value="">Seleccione rol</option>
                                {Object.values(Rol).map((rol) => (
                                  <option key={rol} value={rol}>{rol}</option>
                                ))}
                              </Field>
                              <ErrorMessage name="rol" component="div" className="error-message" />
                            </div>
                          )}
                          
                          {/* Si es admin, mostrar el rol como información de solo lectura */}
                          {normalizedInitialData.rol === 'ADMIN' && (
                            <div className={style.Input}>
                              <label><b>Rol</b></label>
                              <div style={{ 
                                padding: '10px', 
                                backgroundColor: '#f5f5f5', 
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                color: '#666'
                              }}>
                                ADMIN (No editable)
                              </div>
                            </div>
                          )}
                          
                          {/* Botón para corregir rol de admin si el usuario no tiene rol ADMIN pero debería tenerlo */}
                          {normalizedInitialData.email === 'admin@gmail.com' && normalizedInitialData.rol !== 'ADMIN' && (
                            <div className={style.Input}>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await userAPI.corregirRolAdmin(token, normalizedInitialData.id);
                                    onEdited?.();
                                    // window.location.reload(); // Eliminado para evitar recarga
                                  } catch (error) {
                                    console.error('Error corrigiendo rol de admin:', error);
                                    Swal.fire({ 
                                      icon: 'error', 
                                      title: 'Error', 
                                      text: 'No se pudo corregir el rol de admin.' 
                                    });
                                  }
                                }}
                                style={{
                                  background: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '5px',
                                  padding: '10px 15px',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                              >
                                🔧 Corregir Rol a ADMIN
                              </button>
                            </div>
                          )}
                          <div className={style.Input}>
                            <label><b>Estado</b></label>
                            <Field as="select" className={style.Field} name="activo">
                              <option value="true">Activo</option>
                              <option value="false">Inactivo</option>
                            </Field>
                            <ErrorMessage name="activo" component="div" className="error-message" />
                          </div>
                          <div className={style.Input}>
                            <ImageUpload
                              label="Imagen de perfil (opcional)"
                              currentImagePublicId={values.imagenPerfilPublicId && values.imagenPerfilPublicId !== DEFAULT_IMAGE_PUBLIC_ID
                                ? values.imagenPerfilPublicId
                                : undefined}
                              onImageUpload={async (file) => {
                                const publicId = await uploadImageToCloudinary(file, "usuarios");
                                setFieldValue("imagenPerfilPublicId", publicId);
                                return publicId;
                              }}
                              onImageRemove={() => setFieldValue("imagenPerfilPublicId", "")}
                            />
                          </div>
                          {/* Mostrar órdenes del usuario */}
                          <div className={style.Input}>
                            <label><b>Órdenes del usuario</b></label>
                            <div style={{ 
                              border: '1px solid #ccc', 
                              padding: '10px', 
                              borderRadius: '5px',
                              maxHeight: '200px',
                              overflowY: 'auto'
                            }}>
                              {normalizedInitialData.ordenes && normalizedInitialData.ordenes.length > 0 ? (
                                normalizedInitialData.ordenes.map((orden: any) => (
                                  <div key={orden.id} style={{ 
                                    padding: '5px', 
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <span><strong>Orden #{orden.id}</strong></span>
                                    <span style={{ color: '#666', fontSize: '0.9em' }}>
                                      ${orden.total} - {orden.estado}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div style={{ color: '#666', fontStyle: 'italic' }}>
                                  El usuario no tiene órdenes registradas.
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Mostrar direcciones del usuario */}
                          <div className={style.Input}>
                            <label><b>Direcciones del usuario</b></label>
                            <div style={{ 
                              border: '1px solid #ccc', 
                              padding: '10px', 
                              borderRadius: '5px',
                              maxHeight: '200px',
                              overflowY: 'auto'
                            }}>
                              {normalizedInitialData.direcciones && normalizedInitialData.direcciones.length > 0 ? (
                                normalizedInitialData.direcciones.map((dir: any) => (
                                  <div key={dir.id} style={{ 
                                    padding: '5px', 
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <span><strong>{dir.direccion.calle}</strong></span>
                                    <span style={{ color: '#666', fontSize: '0.9em' }}>
                                      {dir.direccion.localidad}, {dir.direccion.cp}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div style={{ color: '#666', fontStyle: 'italic' }}>
                                  El usuario no tiene direcciones registradas.
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        // Lógica original para otros tipos
                        <>
                          {view === 'Addresses' ? (
                            // Campos específicos para Addresses
                            <>
                              <div className={style.Input}>
                                <label><b>Calle</b></label>
                                <Field
                                  className={style.Field}
                                  name="calle"
                                  type="text"
                                />
                                <ErrorMessage name="calle" component="div" className="error-message" />
                              </div>
                              <div className={style.Input}>
                                <label><b>Localidad</b></label>
                                <Field
                                  className={style.Field}
                                  name="localidad"
                                  type="text"
                                />
                                <ErrorMessage name="localidad" component="div" className="error-message" />
                              </div>
                              <div className={style.Input}>
                                <label><b>CP</b></label>
                                <Field
                                  className={style.Field}
                                  name="cp"
                                  type="text"
                                />
                                <ErrorMessage name="cp" component="div" className="error-message" />
                              </div>
                            </>
                          ) : view === 'Sizes' ? (
                            // Campos específicos para Sizes
                            <>
                              <div className={style.Input}>
                                <label><b>Sistema</b></label>
                                <Field as="select" className={style.Field} name="sistema">
                                  <option value="">-- Seleccionar --</option>
                                  {Object.values(SistemaTalle).map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                  ))}
                                </Field>
                                <ErrorMessage name="sistema" component="div" className="error-message" />
                              </div>
                              <div className={style.Input}>
                                <label><b>Valor</b></label>
                                <Field
                                  className={style.Field}
                                  name="valor"
                                  type="text"
                                />
                                <ErrorMessage name="valor" component="div" className="error-message" />
                              </div>
                              {/* Mostrar productos que utilizan este talle */}
                              <div className={style.Input}>
                                <label><b>Productos que utilizan este talle</b></label>
                                <div style={{ 
                                  border: '1px solid #ccc', 
                                  padding: '10px', 
                                  borderRadius: '5px',
                                  maxHeight: '200px',
                                  overflowY: 'auto'
                                }}>
                                  {(() => {
                                    const talleId = normalizedInitialData.id;
                                    if (!talleId) return null;
                                    const productosDelTalle = productos.filter(p => 
                                      p.tallesDisponibles?.some(t => t.id === talleId)
                                    );
                                    
                                    return productosDelTalle.length > 0 ? (
                                      productosDelTalle.map((producto) => (
                                        <div key={producto.id} style={{ 
                                          padding: '5px', 
                                          borderBottom: '1px solid #eee',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center'
                                        }}>
                                          <span><strong>{producto.nombre}</strong></span>
                                          <span style={{ color: '#666', fontSize: '0.9em' }}>
                                            ${producto.precio} - Stock: {producto.cantidad}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <div style={{ color: '#666', fontStyle: 'italic' }}>
                                        Ningún producto utiliza este talle actualmente.
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </>
                          ) : (
                            // Lógica original para otros tipos
                            <>
                              {view === 'Categories' ? (
                                <>
                                  <div className={style.Input}>
                                    <label><b>Nombre</b></label>
                                    <Field
                                      className={style.Field}
                                      name="nombre"
                                      type="text"
                                    />
                                    <ErrorMessage name="nombre" component="div" className="error-message" />
                                  </div>
                                  <div className={style.Input}>
                                    <label><b>Tipos</b></label>
                                    <select
                                      multiple
                                      className={style.Field}
                                      value={(values.tipos || []).map((t: any) => t.id.toString())}
                                      onChange={e => {
                                        const ids = Array.from(e.target.selectedOptions).map(o => +o.value);
                                        setFieldValue('tipos', tipos.filter(t => t.id && ids.includes(t.id)));
                                      }}
                                    >
                                      {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                    </select>
                                    <ErrorMessage name="tipos" component="div" className="error-message" />
                                  </div>
                                  <div className={style.Input}>
                                    <label><b>Productos vinculados a esta categoría</b></label>
                                    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                                      {normalizedInitialData.id && productos.filter(p => p.categoria?.id === normalizedInitialData.id).length > 0 ? (
                                        productos.filter(p => p.categoria?.id === normalizedInitialData.id).map(producto => (
                                          <div key={producto.id} style={{ padding: '5px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span><strong>{producto.nombre}</strong></span>
                                            <span style={{ color: '#666', fontSize: '0.9em' }}>
                                              ${producto.precio} - Stock: {producto.cantidad}
                                            </span>
                                          </div>
                                        ))
                                      ) : (
                                        <div style={{ color: '#666', fontStyle: 'italic' }}>
                                          No hay productos vinculados a esta categoría actualmente.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              ) : view === 'Types' ? (
                                <>
                                  <div className={style.Input}>
                                    <label><b>Nombre</b></label>
                                    <Field
                                      className={style.Field}
                                      name="nombre"
                                      type="text"
                                    />
                                    <ErrorMessage name="nombre" component="div" className="error-message" />
                                  </div>
                                  <div className={style.Input}>
                                    <label><b>Categorías asociadas a este tipo</b></label>
                                    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                                      {categorias.filter(c => c.tipos?.some(t => t.id === normalizedInitialData.id)).length > 0 ? (
                                        categorias.filter(c => c.tipos?.some(t => t.id === normalizedInitialData.id)).map(categoria => (
                                          <div key={categoria.id} style={{ padding: '5px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span><strong>{categoria.nombre}</strong></span>
                                            <span style={{ color: '#666', fontSize: '0.9em' }}>
                                              {categoria.productos?.length || 0} productos
                                            </span>
                                          </div>
                                        ))
                                      ) : (
                                        <div style={{ color: '#666', fontStyle: 'italic' }}>
                                          No hay categorías asociadas a este tipo actualmente.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                // Lógica original para otros tipos
                                Object.entries(normalizedInitialData).map(([key]) => {
                                  if (key === 'id') return null;

                                  // For Categories view: tipo Relationship
                                  if (view === 'Categories' && key === 'tipo') {
                                    return null; // Ya se maneja en el bloque específico de Categories
                                  }

                                  // For Types view: evitar mapeo automático de campos
                                  if (view === 'Types') {
                                    return null; // Ya se maneja en el bloque específico de Types
                                  }

                                  // For Users view: evitar mapeo automático de campos
                                  if (view === 'Users') {
                                    return null; // Ya se maneja en el bloque específico de Users
                                  }

                                  // For Products view: evitar mapeo automático de campos
                                  if (view === 'Products') {
                                    return null; // Ya se maneja en el bloque específico de Products
                                  }

                                  // Para otros campos, renderizar automáticamente
                                  return (
                                    <div className={style.Input} key={key}>
                                      <label><b>{key.charAt(0).toUpperCase() + key.slice(1)}</b></label>
                                      <Field className={style.Field} name={key} />
                                      <ErrorMessage name={key} component="div" className="error-message" />
                                    </div>
                                  );
                                })
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <div className={style.containerButtonsPopUp}>
                      <button type="submit" className={style.buttonEdit}>
                        Editar
                      </button>
                      <button type="button" onClick={handleClose} className={style.buttonClose}>
                        Cancelar
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};
