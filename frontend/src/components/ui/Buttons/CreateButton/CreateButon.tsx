import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import style from "./CreateButton.module.css";
import { usuarioStore } from "../../../../store/usuarioStore";

// HTTP services
import * as userAPI from "../../../../http/usuarioHTTP";
import * as productAPI from "../../../../http/productoHTTP";
import * as categoryAPI from "../../../../http/categoriaHTTP";
import * as typeAPI from "../../../../http/tipoHTTP";
import * as sizeAPI from "../../../../http/talleHTTP";
import * as addressAPI from "../../../../http/direccionHTTP";
import * as orderAPI from "../../../../http/ordenHTTPS";

// Types
import { IOrden } from "../../../../types/IOrden";

interface Props {
  view:
    | "Users"
    | "Products"
    | "Categories"
    | "Types"
    | "Sizes"
    | "Addresses"
    | "Orders";
  onClose: () => void;
  onCreated?: () => void;
}

// Mapeo de esquemas de validación por vista
const schemaMap: Record<Props["view"], yup.ObjectSchema<any>> = {
  Users: yup.object({
    nombre: yup.string().required("❌ El nombre es obligatorio"),
    email: yup.string().email().required("❌ El email es obligatorio"),
    password: yup.string().min(6, "Min. 6 caracteres").required("❌ Requerido"),
  }),
  Products: yup.object({
    nombre: yup.string().required("❌ El nombre es obligatorio"),
    cantidad: yup.number().min(1).required("❌ Requerido"),
    precio: yup.number().min(0.01).required("❌ Requerido"),
    color: yup.string().required("❌ Requerido"),
    talles: yup
      .array()
      .of(yup.string())
      .min(1, "❌ Requerido")
      .required("❌ Requerido"),
    categoria: yup.object({
      id: yup.number().required(),
      nombre: yup.string().required(),
      tipo: yup.string().required(),
    }),
    descripcion: yup.string().required("❌ Requerido"),
  }),
  Categories: yup.object({
    nombre: yup.string().required("❌ El nombre es obligatorio"),
    tipo: yup.string().required("❌ Requerido"),
  }),
  Types: yup.object({
    nombre: yup.string().required("❌ El nombre es obligatorio"),
  }),
  Sizes: yup.object({
    sistema: yup.string().required("❌ Requerido"),
    valor: yup.string().required("❌ Requerido"),
  }),
  Addresses: yup.object({
    calle: yup.string().required("❌ Requerido"),
    localidad: yup.string().required("❌ Requerido"),
    cp: yup.number().min(1, "❌ Requerido").required("❌ Requerido"),
  }),
  Orders: yup.object({
    direccion: yup.string().required("❌ Requerido"),
    detalle: yup.string().required("❌ Requerido"),
    fecha: yup.string().required("❌ Requerido"),
    total: yup.number().min(0, "❌ Requerido").required("❌ Requerido"),
    metodoPago: yup.string().required("❌ Requerido"),
    estado: yup.string().required("❌ Requerido"),
  }),
};

// Valores iniciales por vista
const initialValuesMap: Record<Props["view"], any> = {
  Users: { nombre: "", email: "", password: "" },
  Products: {
    nombre: "",
    cantidad: 0,
    precio: 0,
    color: "",
    talles: [] as string[],
    categoria: { id: 0, nombre: "", tipo: "" },
    descripcion: "",
  },
  Categories: { nombre: "", tipo: "" },
  Types: { nombre: "" },
  Sizes: { sistema: "", valor: "" },
  Addresses: { calle: "", localidad: "", cp: 0 },
  Orders: {
    direccion: "",
    detalle: "",
    fecha: "",
    total: 0,
    metodoPago: "",
    estado: "",
  },
};

// Map de handlers por vista
const createHandlers: Record<
  Props["view"],
  (token: string, values: any) => Promise<boolean>
> = {
  Users: async (_token, values) => !!(await userAPI.registrarUsuario(values)),
  Products: async (token, values) =>
    !!(await productAPI.createProducto(token, values)),
  Categories: async (token, values) =>
    !!(await categoryAPI.createCategoria(token, values)),
  Types: async (_token, values) => !!(await typeAPI.createTipo(values)), // no usa token
  Sizes: async (token, values) => !!(await sizeAPI.createTalle(token, values)),
  Addresses: async (token, values) => {
    const { calle, localidad, cp } = values;
    return !!(await addressAPI.createDireccion(token, {
      calle,
      localidad,
      cp,
    }));
  },
  Orders: async (token, values) => {
    const payload: IOrden = {
      direccion: values.direccion,
      detalle: values.detalle,
      fecha: values.fecha,
      total: values.total,
      metodoPago: values.metodoPago,
      estado: values.estado,
    };
    return !!(await orderAPI.createOrden(token, payload));
  },
};

// Labels en pantalla por vista (en español)
const titleMap: Record<Props["view"], string> = {
  Users: "Usuario",
  Products: "Producto",
  Categories: "Categoría",
  Types: "Tipo",
  Sizes: "Talle",
  Addresses: "Dirección",
  Orders: "Orden",
};

export const CreateButton = ({ view, onClose, onCreated }: Props) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  const handleSubmit = async (values: any) => {
    if (token) {
      const handler = createHandlers[view];
      const success = handler ? await handler(token, values) : false;
      if (success && onCreated) onCreated();
      if (success) onClose();
    }
  };

  const schema = schemaMap[view];
  const initialValues = initialValuesMap[view];

  return (
    <div className={style.popup}>
      <div className={style.popupContent}>
        <h2>Crear nuevo {titleMap[view]}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className={style.Form}>
              <div className={style.containerInput}>
                {Object.entries(initialValues).map(([key]) => (
                  <div className={style.Input} key={key}>
                    <label htmlFor={key}>
                      <b>{key.charAt(0).toUpperCase() + key.slice(1)}</b>
                    </label>
                    <Field
                      className={style.Field}
                      name={key}
                      id={key}
                      type={
                        ["password"].includes(key)
                          ? "password"
                          : ["cantidad", "precio", "total", "cp"].includes(key)
                          ? "number"
                          : "text"
                      }
                      placeholder={key}
                    />
                    <ErrorMessage
                      name={key}
                      component="div"
                      className="error-message"
                    />
                  </div>
                ))}
              </div>
              <div className={style.containerButtonsPopUp}>
                <button type="submit" className={style.buttonSend}>
                  Crear
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={style.buttonClose}
                >
                  Cerrar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
