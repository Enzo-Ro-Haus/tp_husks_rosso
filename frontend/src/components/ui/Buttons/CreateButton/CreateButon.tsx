import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import style from "./CreateButton.module.css";
import { usuarioStore } from "../../../../store/usuarioStore";

import * as userAPI from "../../../../http/usuarioHTTP";
import * as productAPI from "../../../../http/productoHTTP";
import * as categoryAPI from "../../../../http/categoriaHTTP";
import * as typeAPI from "../../../../http/tipoHTTP";
import * as sizeAPI from "../../../../http/talleHTTP";
import * as addressAPI from "../../../../http/direccionHTTP";
import * as orderAPI from "../../../../http/ordenHTTPS";

import { ICategoria } from "../../../../types/ICategoria";
import { ITipo } from "../../../../types/ITipo";
import { IUsuario } from "../../../../types/IUsuario";
import { IDireccion } from "../../../../types/IDireccion";

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

const initialValuesMap: Record<Props["view"], any> = {
  Users: { nombre: "", email: "", password: "" },
  Products: {
    nombre: "",
    cantidad: 0,
    precio: 0,
    color: "",
    talles: [] as string[],
    categoria: { id: 0, nombre: "", tipo: { id: 0, nombre: "" } },
    descripcion: "",
  },
  Categories: { nombre: "", tipo: { id: 0, nombre: "" } },
  Types: { nombre: "", categorias: [] as ICategoria[] }, // Modificado
  Sizes: { sistema: "", valor: "" },
  Addresses: { calle: "", localidad: "", cp: "" },
  Orders: {
    direccion: { id: 0, calle: "", localidad: "", cp: "" },
    usuario: { id: 0, nombre: "", email: "", password: "" },
    detalle: "",
    fecha: new Date().toISOString().substring(0, 10),
    total: 0,
    metodoPago: "",
    estado: "",
  },
};

const schemaMap: Record<Props["view"], yup.ObjectSchema<any>> = {
  Users: yup.object({
    nombre: yup.string().required("❌ El nombre es obligatorio"),
    email: yup.string().email().required("❌ El email es obligatorio"),
    password: yup.string().min(6).required("❌ Requerido"),
  }),
  Products: yup.object({
    nombre: yup.string().required(),
    cantidad: yup.number().min(1).required(),
    precio: yup.number().min(0.01).required(),
    color: yup.string().required(),
    talles: yup.array().of(yup.string()).min(1).required(),
    categoria: yup.object({
      id: yup.number().required(),
      nombre: yup.string().required(),
      tipo: yup.object({
        id: yup.number().required(),
        nombre: yup.string().required(),
      }),
    }),
    descripcion: yup.string().required(),
  }),
  Categories: yup.object({
    nombre: yup.string().required(),
    tipo: yup.object({
      id: yup.number().required(),
      nombre: yup.string().required(),
    }),
  }),
  Types: yup.object({
    nombre: yup.string().required("❌ El nombre es obligatorio"),
    categorias: yup
      .array()
      .of(
        yup.object({
          id: yup.number().required(),
          nombre: yup.string(),
        })
      )
      .min(1, "❌ Debes seleccionar al menos una categoría"),
  }),
  Sizes: yup.object({
    sistema: yup.string().required(),
    valor: yup.string().required(),
  }),
  Addresses: yup.object({
    calle: yup.string().required(),
    localidad: yup.string().required(),
    cp: yup.string().required(),
  }),
  Orders: yup.object({
    direccion: yup.object({ id: yup.number().required() }).required(),
    usuario: yup.object({ id: yup.number().required() }).required(),
    detalle: yup.string().required(),
    fecha: yup.string().required(),
    total: yup.number().min(0).required(),
    metodoPago: yup.string().required(),
    estado: yup.string().required(),
  }),
};

const createHandlers: Record<
  Props["view"],
  (token: string, values: any) => Promise<boolean>
> = {
  Users: async (_token, values) => !!(await userAPI.registrarUsuario(values)),
  Products: async (token, values) =>
    !!(await productAPI.createProducto(token, values)),
  Categories: async (token, values) =>
    !!(await categoryAPI.createCategoria(token, values)),
  Types: async (token, values) => {
    const payload = {
      nombre: values.nombre,
      categorias: values.categorias.map((c: ICategoria) => ({ id: c.id })),
    };
    return !!(await typeAPI.createTipo(token, payload));
  },
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
    const { direccion, usuario, ...rest } = values;
    return !!(await orderAPI.createOrden(token, {
      ...rest,
      direccion,
      usuario,
    }));
  },
};

export const CreateButton = ({ view, onClose, onCreated }: Props) => {
  const token = usuarioStore((s) => s.usuarioActivo?.token)!;

  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [direcciones, setDirecciones] = useState<IDireccion[]>([]);

  useEffect(() => {
    if (view === "Products")
      categoryAPI.getAllCategorias(token).then(setCategorias);
    if (view === "Categories") typeAPI.getAllTipos(token).then(setTipos);
    if (view === "Orders") {
      userAPI.getAllUsuarios(token).then(setUsuarios);
      addressAPI.getAllDireccions(token).then(setDirecciones);
    }
    if (view === "Types")
      categoryAPI.getAllCategorias(token).then(setCategorias); // Modificado para cargar categorías en Types
  }, [view, token]);

  const getOptionLabel = (key: "usuario" | "direccion", o: any) => {
    switch (key) {
      case "usuario":
        return o.nombre || o.email || `Usuario #${o.id}`;
      case "direccion":
        return `${o.calle}, ${o.localidad} (${o.cp})`;
    }
  };

  const handleSubmit = async (values: any) => {
    const handler = createHandlers[view];
    if (!handler) return;
    const success = await handler(token, values);
    if (success) {
      onCreated?.();
      onClose();
    }
  };

  return (
    <div className={style.popup}>
      <div className={style.popupContent}>
        <h2>Crear nuevo {view}</h2>
        <Formik
          initialValues={initialValuesMap[view]}
          validationSchema={schemaMap[view]}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className={style.Form}>
              <div className={style.containerInput}>
                {Object.entries(initialValuesMap[view]).map(([key]) => {
                  const value = (values as any)[key];

                  const renderField = () => {
                    // Selects especiales

                    if (view === "Products" && key === "categoria") {
                      return (
                        <select
                          className={style.Field}
                          value={value?.id || ""}
                          onChange={(e) => {
                            const sel = categorias.find(
                              (c) => c.id === +e.target.value
                            );
                            if (sel) setFieldValue("categoria", sel);
                          }}
                        >
                          <option value="">-- Seleccionar categoría --</option>
                          {categorias.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                      );
                    }

                    if (view === "Categories" && key === "tipo") {
                      return (
                        <select
                          className={style.Field}
                          value={value?.id || ""}
                          onChange={(e) => {
                            const sel = tipos.find(
                              (t) => t.id === +e.target.value
                            );
                            if (sel) setFieldValue("tipo", sel);
                          }}
                        >
                          <option value="">-- Seleccionar tipo --</option>
                          {tipos.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.nombre}
                            </option>
                          ))}
                        </select>
                      );
                    }

                    if (
                      view === "Orders" &&
                      (key === "usuario" || key === "direccion")
                    ) {
                      const options =
                        key === "usuario" ? usuarios : direcciones;
                      return (
                        <select
                          className={style.Field}
                          value={value?.id || ""}
                          onChange={(e) => {
                            const sel = options.find(
                              (o) => o.id === +e.target.value
                            );
                            if (sel) setFieldValue(key, sel);
                          }}
                        >
                          <option value="">-- Seleccionar {key} --</option>
                          {options.map((o) => (
                            <option key={o.id} value={o.id}>
                              {getOptionLabel(
                                key as "usuario" | "direccion",
                                o
                              )}
                            </option>
                          ))}
                        </select>
                      );
                    }

                    // Aquí: select multiple para Types y el campo categorias
                    if (view === "Types" && key === "categorias") {
                      return (
                        <select
                          multiple
                          className={style.Field}
                          value={(value as ICategoria[])
                            .filter((c) => c.id !== undefined)
                            .map((c) => c.id!.toString())}
                          onChange={(e) => {
                            const selectedIds = Array.from(
                              e.target.selectedOptions
                            ).map((opt) => Number(opt.value));
                            const selectedCats = categorias.filter(
                              (c) => c.id! && selectedIds.includes(c.id!)
                            );
                            setFieldValue("categorias", selectedCats);
                          }}
                        >
                          {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                      );
                    }

                    // Vista de array simple (talles)
                    if (key === "talles") {
                      return (
                        <Field
                          className={style.Field}
                          name={key}
                          as="textarea"
                          placeholder="Separar talles por coma (ej: S,M,L)"
                          onBlur={(
                            e: React.FocusEvent<HTMLTextAreaElement>
                          ) => {
                            const parsed = e.target.value
                              .split(",")
                              .map((v) => v.trim());
                            setFieldValue("talles", parsed);
                          }}
                        />
                      );
                    }

                    // Campos normales
                    const type =
                      key === "password"
                        ? "password"
                        : ["cantidad", "precio", "cp", "total"].includes(key)
                        ? "number"
                        : key === "fecha"
                        ? "date"
                        : "text";

                    return (
                      <Field
                        className={style.Field}
                        name={key}
                        id={key}
                        type={type}
                        placeholder={key}
                      />
                    );
                  };

                  return (
                    <div className={style.Input} key={key}>
                      <label htmlFor={key}>
                        <b>{key[0].toUpperCase() + key.slice(1)}</b>
                      </label>
                      {renderField()}
                      <ErrorMessage
                        name={key}
                        component="div"
                        className="error-message"
                      />
                    </div>
                  );
                })}
              </div>

              <div className={style.containerButtonsPopUp}>
                <button type="submit" className={style.buttonSend}>
                  Guardar
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
