import React, { useState, ReactNode } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import style from './EditButton.module.css';
import { usuarioStore } from '../../../../store/usuarioStore';

// HTTP services
import * as userAPI from '../../../../http/usuarioHTTP';
import * as productAPI from '../../../../http/productoHTTP';
import * as categoryAPI from '../../../../http/categoriaHTTP';
import * as typeAPI from '../../../../http/tipoHTTP';
import * as sizeAPI from '../../../../http/talleHTTP';
import * as addressAPI from '../../../../http/direccionHTTP';
import * as orderAPI from '../../../../http/ordenHTTPS';

import { IOrden } from '../../../../types/IOrden';

type ViewType =
  | 'Users'
  | 'Products'
  | 'Categories'
  | 'Types'
  | 'Sizes'
  | 'Addresses'
  | 'Orders'
  | 'Client';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}


interface EditButtonProps {
  view: ViewType;
  initialData: any;
  onClose: () => void;
  onEdited?: () => void;
}

const schemaMap: Record<ViewType, yup.ObjectSchema<any>> = {
  Users: yup.object({
    nombre: yup.string().required('❌ El nombre es obligatorio'),
    email: yup.string().email().required('❌ El email es obligatorio'),
    password: yup.string().min(6, 'Min. 6 caracteres'),
  }),
  Products: yup.object({
    nombre: yup.string().required('❌ El nombre es obligatorio'),
    cantidad: yup.number().min(1).required('❌ Requerido'),
    precio: yup.number().min(0.01).required('❌ Requerido'),
    color: yup.string().required('❌ Requerido'),
    talles: yup.array().of(yup.string()).min(1, '❌ Requerido'),
    categoria: yup.object({ id: yup.number(), nombre: yup.string(), tipo: yup.string() }).required(),
    descripcion: yup.string().required('❌ Requerido'),
  }),
  Categories: yup.object({ nombre: yup.string().required(), tipo: yup.string().required() }),
  Types: yup.object({ nombre: yup.string().required() }),
  Sizes: yup.object({ sistema: yup.string().required(), valor: yup.string().required() }),
  Addresses: yup.object({ calle: yup.string().required(), localidad: yup.string().required(), cp: yup.number().min(1).required() }),
  Orders: yup.object({ direccion: yup.string().required(), detalle: yup.string().required(), fecha: yup.string().required(), total: yup.number().min(0).required(), metodoPago: yup.string().required(), estado: yup.string().required() }),
  Client: yup.object({ nombre: yup.string().required(), email: yup.string().email().required(), password: yup.string().min(6) }),
};

const editHandlers: Record<ViewType, (token: string, id: number, values: any) => Promise<boolean>> = {
  Users: async (token, id, values) => !!(await userAPI.updateUsuario(token, id, values)),
  Products: async (token, id, values) => !!(await productAPI.updateProducto(token, id, values)),
  Categories: async (token, id, values) => !!(await categoryAPI.updateCategoria(token, id, values)),
  Types: async (_t, id, values) => !!(await typeAPI.updateTipo(id, values)),
  Sizes: async (token, id, values) => !!(await sizeAPI.updateTalle(token, id, values)),
  Addresses: async (token, id, values) => !!(await addressAPI.updateDireccion(token, id, values)),
  Orders: async (token, id, values) => {
    const payload: IOrden = { direccion: values.direccion, detalle: values.detalle, fecha: values.fecha, total: values.total, metodoPago: values.metodoPago, estado: values.estado };
    return !!(await orderAPI.updateOrden(token, id, payload));
  },
  Client: async (token, id, values) => !!(await userAPI.updateUsuario(token, id, values)),
};

export const EditButton: React.FC<EditButtonProps> = ({ view, initialData, onClose, onEdited }) => {
  const token = usuarioStore(s => s.usuarioActivo?.token) || '';
  const [open, setOpen] = useState(false);
  const schema = schemaMap[view];

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
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            <Form className={style.Form}>
              <div className={style.containerInput}>
                {Object.entries(initialData || {}).map(([key]) => (
                  key === 'id' ? null : (
                    <div className={style.Input} key={key}>
                      <label htmlFor={key}><b>{key.charAt(0).toUpperCase() + key.slice(1)}</b></label>
                      <Field
                        name={key}
                        id={key}
                      />
                      <ErrorMessage name={key} component='div' className='error-message' />
                    </div>
                  )
                ))}
              </div>
              <div className={style.containerButtonsPopUp}>
                <button type='submit' className={style.buttonSend}>Guardar</button>
                <button type='button' onClick={handleClose} className={style.buttonClose}>Cerrar</button>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </>
  );
};
