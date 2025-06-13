import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import style from './EditButton.module.css';
import { usuarioStore } from '../../../../store/usuarioStore';

import * as userAPI from '../../../../http/usuarioHTTP';
import * as productAPI from '../../../../http/productoHTTP';
import * as categoryAPI from '../../../../http/categoriaHTTP';
import * as typeAPI from '../../../../http/tipoHTTP';
import * as sizeAPI from '../../../../http/talleHTTP';
import * as addressAPI from '../../../../http/direccionHTTP';
import * as orderAPI from '../../../../http/ordenHTTPS';

import { IOrden } from '../../../../types/IOrden';
import { ICategoria } from '../../../../types/ICategoria';
import { ITipo } from '../../../../types/ITipo';
import { IDireccion } from '../../../../types/IDireccion';

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
  }),
  Products: yup.object({
    nombre: yup.string().required(),
    cantidad: yup.number().min(1).required(),
    precio: yup.number().min(0.01).required(),
    color: yup.string().required(),
    talles: yup.array().of(yup.string()).min(1).required(),
    categoria: yup.object({ id: yup.number().required(), nombre: yup.string().required() }).required(),
    descripcion: yup.string().required(),
  }),
  Categories: yup.object({
    nombre: yup.string().required(),
    tipo: yup.object({ id: yup.number().required(), nombre: yup.string().required() }).required(),
  }),
  Types: yup.object({ nombre: yup.string().required() }),
  Sizes: yup.object({ sistema: yup.string().required(), valor: yup.string().required() }),
  Addresses: yup.object({ calle: yup.string().required(), localidad: yup.string().required(), cp: yup.number().min(1).required() }),
  Orders: yup.object({
    direccion: yup.object({ id: yup.number().required() }).required(),
    usuario: yup.object({ id: yup.number().required() }).required(),
    detalle: yup.string().required(),
    fecha: yup.string().required(),
    total: yup.number().min(0).required(),
    metodoPago: yup.string().required(),
    estado: yup.string().required(),
  }),
  Client: yup.object({ nombre: yup.string().required(), email: yup.string().email().required(), password: yup.string().min(6) }),
};

// Handlers to call update endpoints
const editHandlers: Record<ViewType, (token: string, id: number, values: any) => Promise<boolean>> = {
  Users: async (token, id, values) => !!(await userAPI.updateUsuario(token, id, values)),
  Products: async (token, id, values) => !!(await productAPI.updateProducto(token, id, values)),
  Categories: async (token, id, values) => {
    // send object for tipo
    return !!(await categoryAPI.updateCategoria(token, id, values));
  },
  Types: async (_t, id, values) => !!(await typeAPI.updateTipo(id, values)),
  Sizes: async (token, id, values) => !!(await sizeAPI.updateTalle(token, id, values)),
  Addresses: async (token, id, values) => !!(await addressAPI.updateDireccion(token, id, values)),
  Orders: async (token, id, values) => {
    const payload: IOrden = {
      direccion: values.direccion,
      detalle: values.detalle,
      fecha: values.fecha,
      total: values.total,
      metodoPago: values.metodoPago,
      estado: values.estado,
    };
    return !!(await orderAPI.updateOrden(token, id, payload));
  },
  Client: async (token, id, values) => !!(await userAPI.updateUsuario(token, id, values)),
};

export const EditButton: React.FC<EditButtonProps> = ({ view, initialData, onClose, onEdited }) => {
  const token = usuarioStore(s => s.usuarioActivo?.token) || '';
  const [open, setOpen] = useState(false);

  // Related entities
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [talles, setTalles] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      if (view === 'Products') {
        setCategorias(await categoryAPI.getAllCategorias(token) || []);
        setTalles(await sizeAPI.getAllTalles(token) || []);
      }
      if (view === 'Categories') {
        setTipos(await typeAPI.getAllTipos(token) || []);
      }
    };
    load();
  }, [open, view, token]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); onClose(); };

  const handleSubmit = async (values: any) => {
    if (!token) return;
    const handler = editHandlers[view];
    const success = handler ? await handler(token, initialData.id, values) : false;
    if (success && onEdited) onEdited();
    if (success) handleClose();
  };

  return (
    <>
      <button className={style.editButton} onClick={handleOpen}>Edit</button>
      {open && (
        <div className={style.popup}>
          <h2>Editar {view}</h2>
          <Formik
            initialValues={initialData}
            enableReinitialize
            validationSchema={schemaMap[view]}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className={style.Form}>
                <div className={style.containerInput}>
                  {Object.entries(initialData).map(([key]) => {
                    if (key === 'id') return null;

                    // For Categories view: tipo Relationship
                    if (view === 'Categories' && key === 'tipo') {
                      return (
                        <div className={style.Input} key={key}>
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
                      );
                    }

                    // For Products view: categoria relationship
                    if (view === 'Products' && key === 'categoria') {
                      return (
                        <div className={style.Input} key={key}>
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
                      );
                    }

                    // For Products view: talles multiple
                    if (view === 'Products' && key === 'talles') {
                      return (
                        <div className={style.Input} key={key}>
                          <label><b>Talles</b></label>
                          <select
                            multiple
                            className={style.Field}
                            value={(values.talles || []).map((t: any) => t.id.toString())}
                            onChange={e => {
                              const ids = Array.from(e.target.selectedOptions).map(o => +o.value);
                              setFieldValue('talles', talles.filter(t => ids.includes(t.id)));
                            }}
                          >
                            {talles.map(t => <option key={t.id} value={t.id}>{t.sistema} {t.valor}</option>)}
                          </select>
                          <ErrorMessage name="talles" component="div" className="error-message" />
                        </div>
                      );
                    }

                    // Default field
                    return (
                      <div className={style.Input} key={key}>
                        <label><b>{key.charAt(0).toUpperCase() + key.slice(1)}</b></label>
                        <Field
                          className={style.Field}
                          name={key}
                          type={['cantidad','precio','cp','total'].includes(key) ? 'number' : key === 'fecha' ? 'date' : 'text'}
                        />
                        <ErrorMessage name={key} component="div" className="error-message" />
                      </div>
                    );
                  })}
                </div>

                <div className={style.containerButtonsPopUp}>
                  <button type="submit" className={style.buttonSend}>Guardar</button>
                  <button type="button" onClick={handleClose} className={style.buttonClose}>Cerrar</button>
                </div>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
