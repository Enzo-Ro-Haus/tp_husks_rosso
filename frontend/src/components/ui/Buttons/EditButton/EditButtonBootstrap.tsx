import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal, Button, Form as BootstrapForm, Row, Col, Alert, Badge } from "react-bootstrap";
import { usuarioStore } from "../../../../store/usuarioStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
import { productoStore } from "../../../../store/prodcutoStore";

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

export type ViewType =
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
    tipos: yup.array().of(yup.number()).min(0),
  }),
  Types: yup.object({
    nombre: yup.string().required(),
    categorias: yup.array().of(yup.number()).min(0),
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
  }),
  Client: yup.object({
    nombre: yup.string().required("❌ Obligatorio"),
    email: yup.string().email().required("❌ Obligatorio"),
    password: yup.string().min(6).optional(),
    imagenPerfilPublicId: yup.string().optional(),
  }),
};

// Handlers para actualizar elementos
const updateHandlers: Record<ViewType, (token: string, id: number, payload: any) => Promise<any>> = {
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
      console.log('🔍 Products update handler - payload original:', payload);
      
      // Obtener los datos completos de categoría, tipo y talles
      const categorias = await categoryAPI.getAllCategorias(token);
      const tipos = await typeAPI.getAllTipos(token);
      const talles = await sizeAPI.getAllTalles(token);
      
      // Encontrar los objetos completos basados en los IDs
      const categoriaCompleta = payload.categoria && payload.categoria.id ? categorias.find(c => c.id === payload.categoria.id) : null;
      const tipoCompleto = payload.tipo && payload.tipo.id ? tipos.find(t => t.id === payload.tipo.id) : null;
      const talleCompleto = payload.talles?.[0] ? talles.find(t => t.id === payload.talles[0]) : null;
      
      console.log('🔍 Products update handler - objetos encontrados:', {
        categoria: categoriaCompleta,
        tipo: tipoCompleto,
        talle: talleCompleto
      });
      
      // Crear el payload con la estructura correcta
      const processedPayload: any = {};
      
      // Solo incluir campos que tengan valores
      if (payload.nombre !== undefined) processedPayload.nombre = payload.nombre;
      if (payload.precio !== undefined) processedPayload.precio = payload.precio;
      if (payload.cantidad !== undefined) processedPayload.cantidad = payload.cantidad;
      if (payload.descripcion !== undefined) processedPayload.descripcion = payload.descripcion;
      if (payload.color !== undefined) processedPayload.color = payload.color;
      if (payload.imagenPublicId !== undefined) processedPayload.imagenPublicId = payload.imagenPublicId;
      
      // Solo incluir relaciones si se proporcionaron
      if (categoriaCompleta) processedPayload.categoria = categoriaCompleta;
      if (tipoCompleto) processedPayload.tipo = tipoCompleto;
      if (talleCompleto) processedPayload.tallesDisponibles = [talleCompleto];
      
      console.log('🔍 Products update handler - payload procesado:', processedPayload);
      
      const result = await productAPI.updateProducto(token, id, processedPayload);
      console.log('🔍 Products update handler - resultado:', result);
      return !!result;
    } catch (error) {
      console.error('❌ Error updating product:', error);
      return false;
    }
  },
  Categories: async (token, id, payload) => {
    try {
      console.log('=== DEBUG UPDATE HANDLER CATEGORIES ===');
      console.log('Payload recibido:', payload);
      console.log('Payload.tipos:', payload.tipos);
      console.log('Payload.tipos type:', typeof payload.tipos);
      console.log('Payload.tipos isArray:', Array.isArray(payload.tipos));
      
      // Procesar los tipos seleccionados (que ahora vienen en payload.tipos)
      const tiposIds = Array.isArray(payload.tipos) 
        ? payload.tipos.map((t: any) => Number(t))
        : [];
      
      console.log('TiposIds procesados:', tiposIds);
      
      // Limpiar campos auxiliares antes de enviar
      const { tiposExistentes, nuevoTipoNombre, ...categoriaData } = payload;
      categoriaData.tipos = tiposIds;
      
      console.log('CategoriaData final:', categoriaData);
      console.log('========================================');
      
      const result = await categoryAPI.updateCategoria(token, id, categoriaData);
      return result; // Retornar la categoría actualizada en lugar de boolean
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  },
  Types: async (token, id, payload) => {
    try {
      console.log('=== DEBUG UPDATE HANDLER TYPES ===');
      console.log('Payload recibido:', payload);
      console.log('Payload.categorias:', payload.categorias);
      console.log('Payload.categorias type:', typeof payload.categorias);
      console.log('Payload.categorias isArray:', Array.isArray(payload.categorias));
      
      // Procesar las categorías seleccionadas (que ahora vienen en payload.categorias)
      const categoriasIds = Array.isArray(payload.categorias) 
        ? payload.categorias.map((c: any) => Number(c))
        : [];
      
      // Limpiar campos auxiliares antes de enviar
      const { categoriasExistentes, nuevaCategoriaNombre, ...tipoData } = payload;
      tipoData.categorias = categoriasIds;
      
      console.log('TipoData final:', tipoData);
      console.log('========================================');
      
      const result = await typeAPI.updateTipo(token, id, tipoData);
      return result; // Retornar el tipo actualizado en lugar de boolean
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
        // Asegurarse de que el id de la dirección esté presente y válido
        let direccionId = null;
        if (payload.direccion && payload.direccion.id) {
          direccionId = payload.direccion.id;
        } else if (typeof payload.direccion === 'number') {
          direccionId = payload.direccion;
        } else if (payload.id) {
          direccionId = payload.id;
        }
        if (!direccionId) {
          throw new Error('No se encontró un id válido de dirección para actualizar la relación usuario-dirección.');
        }
        const result = await addressAPI.updateUsuarioDireccion(token, id, {
          usuario: payload.usuario,
          direccion: {
            id: direccionId,
            calle: payload.calle,
            localidad: payload.localidad,
            cp: payload.cp
          }
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
      console.log('🔍 EditButtonBootstrap - Orders update payload:', payload);
      const result = await orderAPI.updateOrden(token, id, payload);
      return !!result;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  },
  Client: async (token, id, payload) => {
    try {
      const usuarioActivo = usuarioStore.getState().usuarioActivo;
      if (usuarioActivo && usuarioActivo.rol === "CLIENTE" && usuarioActivo.id === id) {
        // El cliente edita su propio perfil
        const result = await userAPI.updateUsuarioMe(token, payload);
        return !!result;
      } else {
        // Admin editando un cliente
        const result = await userAPI.updateUsuario(token, id, payload);
        return !!result;
      }
    } catch (error) {
      console.error('Error updating client:', error);
      return false;
    }
  },
};

const DEFAULT_IMAGE_PUBLIC_ID = "user_img";

export const EditButtonBootstrap: React.FC<Props> = ({ view, item, onClose, onUpdated }) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token)!;
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [direcciones, setDirecciones] = useState<IUsuarioDireccion[]>([]);
  const [talles, setTalles] = useState<any[]>([]);
  const [productos, setProductos] = useState<IProducto[]>([]);
  
  // Store de direcciones de usuario-dirección
  const direccionesFromStore = direccionStore((s) => s.direcciones);

  // Estado de búsqueda para tipos en Categories
  const [searchTipos, setSearchTipos] = useState("");
  const [searchCategorias, setSearchCategorias] = useState("");

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
    console.log('🔍 EditButtonBootstrap - handleSubmit iniciado para view:', view);
    console.log('🔍 EditButtonBootstrap - values recibidos:', values);
    console.log('🔍 EditButtonBootstrap - item.id:', item.id);
    
    let payload = { ...values };
    try {
      // --- CORRECCIÓN PARA DETALLES DE ORDENES ---
      if (view === "Orders") {
        // Solo enviar detalles con id si existen, y sin id si son nuevos
        payload.detalles = (values.detalles || []).map((detalle: any) => {
          if (detalle.id) {
            return { id: detalle.id, producto: { id: detalle.producto.id }, cantidad: detalle.cantidad };
          } else {
            return { producto: { id: detalle.producto.id }, cantidad: detalle.cantidad };
          }
        });
      }
      
      // --- CORRECCIÓN PARA TYPES ---
      if (view === "Types") {
        payload = {
          nombre: values.nombre,
          categorias: Array.isArray(values.categorias) ? values.categorias.map((id: any) => ({ id: Number(id) })) : []
        };
      }
      
      // Para Users, solo incluir password si se proporcionó una nueva
      if (view === "Users" || view === "Client") {
        const { password, direcciones, nuevaDireccionCalle, nuevaDireccionLocalidad, nuevaDireccionCP, ...rest } = values;
        payload = { ...rest };
        if (password && password.trim() !== "") {
          payload.password = password;
        }
        // --- CORRECCIÓN SOLO PARA CLIENTE ---
        if (view === "Client") {
          // Solo enviar los campos permitidos
          payload = {
            nombre: values.nombre,
            email: values.email,
            imagenPerfilPublicId: values.imagenPerfilPublicId
          };
          if (password && password.trim() !== "") {
            payload.password = password;
          }
          console.log("[FRONT] PATCH /usuario/me - payload enviado:", payload, JSON.stringify(payload));
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
      
      // En handleSubmit, al guardar Types, enviar solo los IDs de categorias
      if (view === "Types") {
        payload = {
          ...payload,
          categorias: values.categorias || []
        };
      }
      
      if (!item.id) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'ID del elemento no encontrado.' });
        return;
      }
      
      console.log('🔍 EditButtonBootstrap - payload final:', payload);
      console.log('🔍 EditButtonBootstrap - handler encontrado:', !!updateHandlers[view]);
      
      const handler = updateHandlers[view];
      const result = await handler(token, item.id, payload);
      console.log('[FRONT] PATCH /usuario/me - resultado del handler:', result);
      
      if (result) {
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
          if (result && typeof result === 'object' && result.id) {
            categoriaStore.getState().editarUnaCategoria(result);
            // Recarga todos los tipos y categorías para asegurar sincronización
            const tiposActualizados = await typeAPI.getAllTipos(token);
            tipoStore.getState().setArrayTipos(tiposActualizados);
            const categoriasActualizadas = await categoryAPI.getAllCategorias(token);
            categoriaStore.getState().setArraycategorias(categoriasActualizadas);
          } else {
            console.log('🔄 Recargando todas las categorías desde la API');
            const categoriasActualizadas = await categoryAPI.getAllCategorias(token);
            categoriaStore.getState().setArraycategorias(categoriasActualizadas);
            
            // También actualizar tipos
            const tiposActualizados = await typeAPI.getAllTipos(token);
            tipoStore.getState().setArrayTipos(tiposActualizados);
          }
        }
        if (view === "Types") {
          // Usar el método específico para editar un tipo en lugar de recargar todo
          if (result && typeof result === 'object' && result.id) {
            tipoStore.getState().editarUnTipo(result);
            // Recarga todos los tipos y categorías para asegurar sincronización
            const tiposActualizados = await typeAPI.getAllTipos(token);
            tipoStore.getState().setArrayTipos(tiposActualizados);
            const categoriasActualizadas = await categoryAPI.getAllCategorias(token);
            categoriaStore.getState().setArraycategorias(categoriasActualizadas);
          } else {
            console.log('🔄 Recargando todos los tipos desde la API');
            const tiposActualizados = await typeAPI.getAllTipos(token);
            tipoStore.getState().setArrayTipos(tiposActualizados);
            
            // También actualizar categorías
            const categoriasActualizadas = await categoryAPI.getAllCategorias(token);
            categoriaStore.getState().setArraycategorias(categoriasActualizadas);
          }
        }
        if (view === "Products") {
          // Actualizar el store de productos
          const productosActualizados = await productAPI.getAllProductos(token);
          productoStore.getState().setArrayProductos(productosActualizados);
          console.log('✅ Producto actualizado exitosamente');
        }
        if (view === "Addresses") {
          // Actualizar el store de direcciones con todas las direcciones (incluyendo soft delete)
          const direccionesActualizadas = await addressAPI.getAllUsuarioDirecciones(token);
          direccionStore.getState().setArrayDirecciones(direccionesActualizadas);
          
          // Actualizar el store de usuarios para que aparezcan las direcciones en las ListCard
          const usuariosActualizados = await userAPI.getAllUsuarios(token);
          usuarioStore.getState().setArrayUsuarios(usuariosActualizados);
        }
        if (view === "Client") {
          // Actualizar el usuario activo en el store, manteniendo el token y normalizando el rol
          const usuarioStoreState = usuarioStore.getState();
          // Normalizar el campo rol a string y convertir a Rol si es válido
          let rolNormalizado: any = undefined;
          if (typeof result.rol === "string") {
            rolNormalizado = result.rol;
          } else if (result.rol && typeof result.rol === "object" && "name" in result.rol) {
            rolNormalizado = (result.rol as any).name;
          }
          const rolesValidos = ["ADMIN", "CLIENTE"];
          const rolFinal = rolesValidos.includes(rolNormalizado) ? rolNormalizado : undefined;

          // usuarioStoreState.setUsuarioActivo({ ...result, token: usuarioStoreState.usuarioActivo?.token || null, rol: rolFinal });
          usuarioStoreState.setUsuarioPendienteActualizar(true); // <-- Solo marcar pendiente
        }
        onUpdated?.();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el elemento.' });
      }
    } catch (err: any) {
      console.error('🔍 EditButtonBootstrap - Error en handleSubmit:', err);
      console.error('🔍 EditButtonBootstrap - Error response:', err.response?.data);
      console.error('🔍 EditButtonBootstrap - Error status:', err.response?.status);
      console.error('🔍 EditButtonBootstrap - Error message:', err.message);
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

    // Debug para Addresses
    if (view === "Addresses") {
      console.log('🔍 EditButtonBootstrap - item para Addresses:', item);
      console.log('🔍 EditButtonBootstrap - item.usuario:', item.usuario);
      console.log('🔍 EditButtonBootstrap - item.direccion:', item.direccion);
      console.log('🔍 EditButtonBootstrap - item keys:', Object.keys(item));
      console.log('🔍 EditButtonBootstrap - item completo expandido:', JSON.stringify(item, null, 2));
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
          categoria: item.categoria || null,
          tipo: item.tipo || null,
          descripcion: item.descripcion || "",
          imagenPublicId: item.imagenPublicId || "",
        };
      case "Categories":
        return {
          nombre: item.nombre || "",
          tipos: Array.isArray(item.tipos)
            ? item.tipos.map((t: any) => typeof t === "object" && t.id ? Number(t.id) : Number(t))
            : [],
        };
      case "Types":
        // Inicializar con IDs de las categorías asociadas
        return {
          nombre: item.nombre || item.name || "",
          categorias: Array.isArray(item.categorias)
            ? item.categorias.map((c: any) => typeof c === "object" && c.id ? Number(c.id) : Number(c))
            : [],
        };
      case "Sizes":
        return {
          sistema: item.sistema || "",
          valor: item.valor || "",
        };
      case "Addresses":
        // Debug detallado para entender la estructura del item
        console.log('🔍 EditButtonBootstrap - item completo para Addresses:', item);
        console.log('🔍 EditButtonBootstrap - item.usuario:', item.usuario);
        console.log('🔍 EditButtonBootstrap - item.direccion:', item.direccion);
        console.log('🔍 EditButtonBootstrap - item.street:', item.street);
        console.log('🔍 EditButtonBootstrap - item.locality:', item.locality);
        console.log('🔍 EditButtonBootstrap - item.pc:', item.pc);
        
        const addressValues = {
          usuario: item.usuario || { id: 0 },
          usuarioOriginal: item.usuario || { id: 0 }, // Guardar usuario original para comparar
          direccion: item.direccion || { id: item.id || 0 },
          calle: item.street || item.direccion?.calle || "",
          localidad: item.locality || item.direccion?.localidad || "",
          cp: item.pc || item.direccion?.cp || "",
        };
        
        console.log('🔍 EditButtonBootstrap - addressValues calculados:', addressValues);
        return addressValues;
      case "Orders":
        console.log('🔍 EditButtonBootstrap - item para Orders:', item);
        console.log('🔍 EditButtonBootstrap - item.detalles:', item.detalles);
        console.log('🔍 EditButtonBootstrap - item.detalle:', item.detalle);
        console.log('🔍 EditButtonBootstrap - item keys:', Object.keys(item));
        
        // Mapear la estructura antigua del backend a la nueva estructura del frontend
        const detalles = item.detalle || item.detalles || [];
        const precioTotal = item.total || item.precioTotal || 0;
        
        // 🔧 LIMPIAR DETALLES DUPLICADOS Y CONSERVAR ID
        const detallesUnicos = detalles.reduce((acc: any[], detalle: any) => {
          const productoId = detalle.producto?.id;
          const detalleExistente = acc.find(d => d.producto?.id === productoId);
          if (detalleExistente) {
            // Si ya existe, sumar las cantidades y conservar el id del detalle existente
            detalleExistente.cantidad += detalle.cantidad || 0;
            // Si el detalle existente no tiene id pero el nuevo sí, asignar el id
            if (!detalleExistente.id && detalle.id) {
              detalleExistente.id = detalle.id;
            }
          } else {
            // Si no existe, agregarlo (con id si tiene)
            acc.push({ ...detalle });
          }
          return acc;
        }, []);
        
        console.log('🔍 EditButtonBootstrap - detalles originales:', detalles);
        console.log('🔍 EditButtonBootstrap - detalles únicos:', detallesUnicos);
        console.log('🔍 EditButtonBootstrap - precioTotal mapeado:', precioTotal);
        
        return {
          usuario: item.usuario || null,
          usuarioDireccion: item.usuarioDireccion || null,
          detalles: detallesUnicos,
          fecha: item.fecha || new Date().toISOString().slice(0, 16),
          precioTotal: precioTotal,
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

  // Helper function para verificar si es una orden y tiene detalles
  const isOrderWithDetails = (values: any) => {
    return view === "Orders" && values && typeof values === 'object' && 'detalles' in values;
  };

  const renderField = (key: string, values: any, setFieldValue: any) => {
    // Debug para Addresses
    if (view === "Addresses") {
      console.log('🔍 EditButtonBootstrap - renderField procesando key:', key, 'values[key]:', values[key]);
    }
    
    // Campos que no deben mostrarse en el formulario
    const camposAuxiliares = [
      "productoSeleccionado", "cantidadProducto",
      "nuevaDireccionCalle", "nuevaDireccionLocalidad", "nuevaDireccionCP",
      "usuarioOriginal", "direccion"
    ];
    
    // Excluir campos de imagen que se manejan con componentes especiales
    const camposImagen = ["imagenPublicId", "imagenPerfilPublicId"];
    if (camposImagen.includes(key)) return null;
    
    if (camposAuxiliares.includes(key)) return null;
    if (view === "Orders" && (key === "detalles" || key === "precioTotal")) return null;
    if (view === "Addresses" && key === "usuarioDireccion") return null;

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
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted fst-italic">No addresses have been added.</p>
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

    // Reemplazo el renderizado de la selección múltiple de tipos en Categoría
    if (view === "Categories" && key === "tipos") {
      const selectedIds = (values.tipos || []).map((t: any) => Number(t));
      const tiposSeleccionados = tipos.filter((t) => selectedIds.includes(Number(t.id)));
      const tiposNoSeleccionados = tipos.filter((t) => !selectedIds.includes(Number(t.id)) && t.nombre.toLowerCase().includes(searchTipos.toLowerCase()));
      return (
        <Col md={12} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Tipos asociados</strong></BootstrapForm.Label>
            <div className="border rounded p-3">
              <Row className="mb-2 align-items-center">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                  <BootstrapForm.Control
                    type="text"
                    placeholder="Buscar tipo..."
                    value={searchTipos}
                    onChange={e => setSearchTipos(e.target.value)}
                    size="sm"
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => setFieldValue("tipos", tipos.map(t => Number(t.id)))}
                    disabled={tipos.length === 0}
                  >
                    Select all
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setFieldValue("tipos", [])}
                    disabled={tiposSeleccionados.length === 0}
                  >
                    Deselect all
                  </Button>
                </Col>
              </Row>
              <div className="mb-2">
                <strong>Seleccionados ({tiposSeleccionados.length}):</strong>
                <div className="d-flex flex-wrap mt-2">
                  {tiposSeleccionados.length === 0 && (
                    <span className="text-muted ms-2">None</span>
                  )}
                  {tiposSeleccionados.map((tipo: any) => (
                    <Badge
                      key={tipo.id}
                      bg="info"
                      text="dark"
                      className="me-2 mb-2"
                      style={{ cursor: "pointer" }}
                      pill
                      onClick={() => setFieldValue("tipos", selectedIds.filter((id: number) => id !== Number(tipo.id)))}
                    >
                      {tipo.nombre} <span style={{ marginLeft: 4, cursor: "pointer" }}>×</span>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <strong>Others types:</strong>
                <div className="d-flex flex-wrap mt-2">
                  {tiposNoSeleccionados.length === 0 && (
                    <span className="text-muted ms-2">None</span>
                  )}
                  {tiposNoSeleccionados
                    .filter((tipo: any) => tipo.nombre.toLowerCase().includes(searchTipos.toLowerCase()))
                    .map((tipo: any) => (
                      <Badge
                        key={tipo.id}
                        bg="light"
                        text="dark"
                        className="me-2 mb-2"
                        style={{ cursor: "pointer", border: "1px solid #0dcaf0" }}
                        pill
                        onClick={() => setFieldValue("tipos", [...selectedIds, Number(tipo.id)])}
                      >
                        {tipo.nombre} <span style={{ marginLeft: 4, color: "#0dcaf0" }}>+</span>
                      </Badge>
                    ))}
                </div>
              </div>
              <ErrorMessage name="tipos" component="div" className="text-danger small" />
            </div>
          </BootstrapForm.Group>
        </Col>
      );
    }

    // UI de selección múltiple con buscador y badges para 'categorias' en Types (igual que en Categories)
    if (view === "Types" && key === "categorias") {
      // IDs de categorías asociadas al Type
      const selectedIds = (values.categorias || []).map((id: any) => Number(id));
      // Mapear a objetos completos del store
      const categoriasSeleccionadas = categorias.filter((c) => selectedIds.includes(Number(c.id)));
      const categoriasNoSeleccionadas = categorias.filter((c) => !selectedIds.includes(Number(c.id)) && c.nombre.toLowerCase().includes(searchCategorias.toLowerCase()));
      return (
        <Col md={12} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Associated categories</strong></BootstrapForm.Label>
            <div className="border rounded p-3">
              <Row className="mb-2 align-items-center">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                  <BootstrapForm.Control
                    type="text"
                    placeholder="Buscar categoría..."
                    value={searchCategorias}
                    onChange={e => setSearchCategorias(e.target.value)}
                    size="sm"
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => setFieldValue("categorias", categorias.map(c => Number(c.id)))}
                    disabled={categorias.length === 0}
                  >
                    Select all
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setFieldValue("categorias", [])}
                    disabled={categoriasSeleccionadas.length === 0}
                  >
                    Deselect all
                  </Button>
                </Col>
              </Row>
              <div className="mb-2">
                <strong>Selected ({categoriasSeleccionadas.length}):</strong>
                <div className="d-flex flex-wrap mt-2">
                  {categoriasSeleccionadas.length === 0 && (
                    <span className="text-muted ms-2">None</span>
                  )}
                  {categoriasSeleccionadas.map((categoria: any) => (
                    <Badge
                      key={categoria.id}
                      bg="info"
                      text="dark"
                      className="me-2 mb-2"
                      style={{ cursor: "pointer" }}
                      pill
                      onClick={() => setFieldValue("categorias", selectedIds.filter((id: number) => id !== Number(categoria.id)))}
                    >
                      {categoria.nombre} <span style={{ marginLeft: 4, cursor: "pointer" }}>×</span>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <strong>Others categories:</strong>
                <div className="d-flex flex-wrap mt-2">
                  {categoriasNoSeleccionadas.length === 0 && (
                    <span className="text-muted ms-2">None</span>
                  )}
                  {categoriasNoSeleccionadas.map((categoria: any) => (
                    <Badge
                      key={categoria.id}
                      bg="light"
                      text="dark"
                      className="me-2 mb-2"
                      style={{ cursor: "pointer", border: "1px solid #0dcaf0" }}
                      pill
                      onClick={() => setFieldValue("categorias", [...selectedIds, Number(categoria.id)])}
                    >
                      {categoria.nombre} <span style={{ marginLeft: 4, color: "#0dcaf0" }}>+</span>
                    </Badge>
                  ))}
                </div>
              </div>
              <ErrorMessage name="categorias" component="div" className="text-danger small" />
            </div>
          </BootstrapForm.Group>
        </Col>
      );
    }

    // Campos específicos para Sizes
    if (view === "Sizes" && key === "sistema") {
      return (
        <BootstrapForm.Group key={key} className="mb-3" controlId={key}>
          <BootstrapForm.Label><b>Size system</b></BootstrapForm.Label>
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
          <BootstrapForm.Label><b>Value</b></BootstrapForm.Label>
          <Field name={key}>
            {({ field }: any) => (
              <BootstrapForm.Control type="text" {...field} />
            )}
          </Field>
          <ErrorMessage name={key} component="div" className="error-message visible" />
        </BootstrapForm.Group>
      );
    }

    // Manejo especial para el campo sistema en Sizes
    if (view === "Sizes" && key === "sistema") {
      return (
        <Col md={6} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label>
              <strong>Size system</strong>
            </BootstrapForm.Label>
            <Field as="select" name={key} className="form-select">
              <option value="">Select system</option>
              <option value="americano">USA</option>
              <option value="europeo">EU</option>
            </Field>
            <ErrorMessage name={key} component="div" className="text-danger small" />
          </BootstrapForm.Group>
        </Col>
      );
    }

    // Manejo específico para campos de dirección en Addresses
    if (view === "Addresses" && (key === "calle" || key === "localidad" || key === "cp")) {
      console.log(`🔍 EditButtonBootstrap - Renderizando campo ${key} con valor:`, values[key]);
      return (
        <Col md={4} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label>
              <strong>
                {key === "calle" ? "Calle" : 
                 key === "localidad" ? "Localidad" : 
                 key === "cp" ? "CP" : (key as string).charAt(0).toUpperCase() + (key as string).slice(1)}
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

    // Manejo especial para campos de Products
    if (view === "Products") {
      if (key === "categoria") {
        return (
          <Col md={6} key={key}>
            <BootstrapForm.Group>
              <BootstrapForm.Label><strong>Categorie</strong></BootstrapForm.Label>
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
                value={values.categoria?.id || ""}
              >
                <option value="">Select categorie</option>
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
              <BootstrapForm.Label><strong>Type</strong></BootstrapForm.Label>
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
                value={values.tipo?.id || ""}
              >
                <option value="">Select type</option>
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
              <BootstrapForm.Label><strong>Size</strong></BootstrapForm.Label>
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
                value={values.talles?.[0] || ""}
              >
                <option value="">Select size</option>
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

    // Manejar campos específicos
    if (view === "Orders") {
      if (key === "usuario") {
        return (
          <Col md={6} key={key}>
            <BootstrapForm.Group>
              <BootstrapForm.Label><strong>User</strong></BootstrapForm.Label>
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
                <option value="">Select user</option>
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
              <BootstrapForm.Label><strong>Address</strong></BootstrapForm.Label>
              <Field
                as="select"
                name="usuarioDireccion.id"
                className="form-select"
                disabled={!usuarioSeleccionado}
              >
                <option value="">Select address</option>
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
    
    // Manejar campo usuario específicamente para Addresses
    if (view === "Addresses" && key === "usuario") {
      return (
        <Col md={6} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>User</strong></BootstrapForm.Label>
            <Field
              as="select"
              name="usuario.id"
              className="form-select"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const selected = usuarios.find(o => o.id === +e.target.value);
                if (selected) {
                  setFieldValue("usuario", selected);
                }
              }}
            >
              <option value="">Select user</option>
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

    // Campos básicos
    const inputType = key === "password" ? "password" : 
                     key === "email" ? "email" : 
                     key === "precio" || key === "cantidad" ? "number" : 
                     key === "fecha" ? "datetime-local" : "text";

    // Manejo específico para el campo fecha en Orders
    if (view === "Orders" && key === "fecha") {
      return (
        <Col md={6} key={key}>
          <BootstrapForm.Group>
            <BootstrapForm.Label><strong>Order date</strong></BootstrapForm.Label>
            <Field
              name={key}
              type="datetime-local"
              className="form-control"
              placeholder="Seleccionar fecha y hora"
            />
            <small className="text-muted">Select the order date and time</small>
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
            <BootstrapForm.Label><strong>Payment method</strong></BootstrapForm.Label>
            <Field
              as="select"
              name={key}
              className="form-select"
            >
              <option value="">Select payment method</option>
              {Object.values(MetodoPago).map((metodo) => (
                <option key={metodo} value={metodo} selected={values.metodoPago === metodo}>
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
            <BootstrapForm.Label><strong>Order status</strong></BootstrapForm.Label>
            <Field
              as="select"
              name={key}
              className="form-select"
            >
              <option value="">Select status</option>
              {Object.values(EstadoOrden).map((estado) => (
                <option key={estado} value={estado} selected={values.estado === estado}>
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
          <BootstrapForm.Label>
            <strong>
              {key === "password" ? "Password (opcional)" : key.charAt(0).toUpperCase() + key.slice(1)}
            </strong>
          </BootstrapForm.Label>
          <Field
            name={key}
            type={inputType}
            className="form-control"
            placeholder={key === "password" ? "Leave blank to keep the current one" : key}
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

  // Obtener valores iniciales una sola vez
  const initialValues = getInitialValues();
  console.log('🔍 EditButtonBootstrap - initialValues finales:', initialValues);

  return (
    <Modal show={true} onHide={onClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit {view}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={schemaMap[view]}
          onSubmit={handleSubmit}
        >
          {(formik) => {
            // Sincronizar categorías seleccionadas cuando el store se cargue (para Types)
            React.useEffect(() => {
              if (view === "Types" && item && categorias.length > 0) {
                const idsAsociadas = Array.isArray(item.categorias)
                  ? item.categorias.map((c: any) => typeof c === "object" && c.id ? Number(c.id) : Number(c))
                  : [];
                const idsFormik = Array.isArray((formik.values as any).categorias)
                  ? (formik.values as any).categorias.map((id: any) => Number(id)).sort()
                  : [];
                const idsStore = idsAsociadas.sort();
                if (JSON.stringify(idsFormik) !== JSON.stringify(idsStore)) {
                  formik.setFieldValue("categorias", idsAsociadas);
                }
              }
              // eslint-disable-next-line
            }, [categorias, item]);
            return (
              <Form>
                <Row>
                  {Object.keys(initialValues).map((key) =>
                    renderField(key, formik.values, formik.setFieldValue)
                  )}

                  {view === "Products" && "imagenPublicId" in formik.values && (
                    <Col md={12}>
                      <BootstrapForm.Group>
                        <BootstrapForm.Label><strong>Product image</strong></BootstrapForm.Label>
                        <ImageUpload
                          label=""
                          currentImagePublicId={formik.values.imagenPublicId}
                          onImageUpload={async (file) => {
                            const publicId = await uploadImageToCloudinary(file, "productos");
                            formik.setFieldValue("imagenPublicId", publicId);
                            return publicId;
                          }}
                          onImageRemove={() => formik.setFieldValue("imagenPublicId", "")}
                        />
                      </BootstrapForm.Group>
                    </Col>
                  )}

                  {view === "Users" && "imagenPerfilPublicId" in formik.values && (
                    <Col md={12}>
                      <BootstrapForm.Group>
                        <BootstrapForm.Label><strong>Profile picture (optional)</strong></BootstrapForm.Label>
                        <ImageUpload
                          label=""
                          currentImagePublicId={formik.values.imagenPerfilPublicId && formik.values.imagenPerfilPublicId !== "" ? formik.values.imagenPerfilPublicId : undefined}
                          onImageUpload={async (file) => {
                            const publicId = await uploadImageToCloudinary(file, "usuarios");
                            formik.setFieldValue("imagenPerfilPublicId", publicId);
                            return publicId;
                          }}
                          onImageRemove={() => formik.setFieldValue("imagenPerfilPublicId", "")}
                        />
                      </BootstrapForm.Group>
                    </Col>
                  )}

                  {view === "Orders" && (
                    <Col md={12}>
                      <BootstrapForm.Group>
                        <BootstrapForm.Label><strong>Order products</strong></BootstrapForm.Label>
                        <div className="border rounded p-3">
                          {(formik.values as any).detalles && Array.isArray((formik.values as any).detalles) && (formik.values as any).detalles.length > 0 ? (
                            (formik.values as any).detalles.map((item: any, index: number) => {
                              const producto = productos.find(p => p.id === item.producto.id);
                              const stockDisponible = producto?.cantidad || 0;
                              const cantidadEnOrden = item.cantidad;
                              const excedeStock = cantidadEnOrden > stockDisponible;
                              return (
                                <div key={index} className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2">
                                  <span>
                                    <strong>Product:</strong> {producto?.nombre || 'Producto no encontrado'} | 
                                    <strong>Quantity:</strong> {item.cantidad || 0} | 
                                    <strong>Stock:</strong> {stockDisponible}
                                    {excedeStock && (
                                      <Badge bg="danger" className="ms-2">⚠️ Excede stock</Badge>
                                    )}
                                  </span>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                      // Eliminar el producto del array de detalles completamente
                                      const newDetalles = (formik.values as any).detalles.filter((detalle: any, i: number) => detalle.producto.id !== item.producto.id);
                                      formik.setFieldValue("detalles", newDetalles);
                                      // Recalcular el total
                                      const nuevoTotal = newDetalles.reduce((sum: number, item: any) => {
                                        const producto = productos.find(p => p.id === item.producto.id);
                                        return sum + (producto?.precio || 0) * (item.cantidad || 0);
                                      }, 0);
                                      formik.setFieldValue("precioTotal", nuevoTotal);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-muted fst-italic">No products have been added.</p>
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
                                      formik.setFieldValue("productoSeleccionado", productoId);
                                      formik.setFieldValue("cantidadProducto", 1);
                                    }
                                  }}
                                  value={"productoSeleccionado" in formik.values ? formik.values.productoSeleccionado : ""}
                                >
                                  <option value="">Select product</option>
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
                                    const productoId = "productoSeleccionado" in formik.values ? formik.values.productoSeleccionado : undefined;
                                    const producto = productos.find(p => p.id === productoId);
                                    const stockDisponible = producto?.cantidad || 0;
                                    if (cantidad > stockDisponible) {
                                      e.target.setCustomValidity(`La cantidad no puede exceder el stock disponible (${stockDisponible})`);
                                    } else {
                                      e.target.setCustomValidity('');
                                    }
                                    formik.setFieldValue("cantidadProducto", cantidad);
                                  }}
                                  value={"cantidadProducto" in formik.values ? formik.values.cantidadProducto : 1}
                                />
                              </Col>
                              <Col md={3}>
                                <Button
                                  variant="success"
                                  onClick={() => {
                                    const productoId = "productoSeleccionado" in formik.values ? formik.values.productoSeleccionado : undefined;
                                    const cantidad = "cantidadProducto" in formik.values ? formik.values.cantidadProducto : 1;
                                    const producto = productos.find(p => p.id === productoId);
                                    const stockDisponible = producto?.cantidad || 0;
                                    if (productoId && cantidad && cantidad > 0 && cantidad <= stockDisponible) {
                                      // Buscar si ya existe el producto en detalles
                                      const detallesActuales = (formik.values as any).detalles || [];
                                      const indexExistente = detallesActuales.findIndex((item: any) => item.producto.id === productoId);
                                      let newDetalles;
                                      if (indexExistente !== -1) {
                                        // Si ya existe, sumamos la cantidad
                                        newDetalles = detallesActuales.map((item: any, idx: number) =>
                                          idx === indexExistente
                                            ? { ...item, cantidad: item.cantidad + cantidad }
                                            : item
                                        );
                                      } else {
                                        // Si no existe, lo agregamos
                                        newDetalles = [...detallesActuales, { producto: { id: productoId }, cantidad }];
                                      }
                                      formik.setFieldValue("detalles", newDetalles);
                                      formik.setFieldValue("productoSeleccionado", "");
                                      formik.setFieldValue("cantidadProducto", 1);
                                      // Recalcular el total
                                      const nuevoTotal = newDetalles.reduce((sum: number, item: any) => {
                                        const producto = productos.find(p => p.id === item.producto.id);
                                        return sum + (producto?.precio || 0) * (item.cantidad || 0);
                                      }, 0);
                                      formik.setFieldValue("precioTotal", nuevoTotal);
                                    } else if (cantidad && Number(cantidad) > stockDisponible) {
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Stock insuficiente',
                                        text: `La cantidad solicitada (${cantidad}) excede el stock disponible (${stockDisponible})`,
                                      });
                                    }
                                  }}
                                >
                                  Add
                                </Button>
                              </Col>
                            </Row>
                            {(formik.values as any).productoSeleccionado && (
                              <small className="text-muted">
                                Stock: {productos.find(p => p.id === Number((formik.values as any).productoSeleccionado))?.cantidad || 0} unidades
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
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </Modal.Footer>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};