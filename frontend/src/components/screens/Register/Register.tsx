import { ErrorMessage, Field, Form, Formik } from "formik";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./Register.module.css";
import * as yup from "yup";
import { usuarioStore } from "../../../store/usuarioStore";
import { registrarUsuario } from "../../../http/usuarioHTTP";
import { IUsuario } from "../../../types/IUsuario";
import { useEffect } from "react";

const schemaYup = yup.object().shape({
  name: yup
    .string()
    .min(1, "El nombre no puede quedar vacío")
    .required(" ❌ El nombre es obligatorio"),
  email: yup.string().email().required("❌ El email es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .required(" ❌ La contraseña es obligatoria"),
});

interface IValues {
  name: string;
  email: string;
  password: string;
  rol: "ADMIN" | "CLIENTE";
}

export const Register = () => {
  const setUsuarioActivo = usuarioStore((state) => state.setUsuarioActivo);
  const setToken = usuarioStore((state) => state.setToken);
  const usuario = usuarioStore((state) => state.usuarioActivo);

  const handleSubmit = async (values: IValues) => {

    const nuevoUsuario: IUsuario = {
      nombre: values.name.trim(),
      email: values.email.trim(),
      contrasenia: values.password.trim(),
      rol: values.rol,
    };

    console.log("enviando a registrarUsuario:", nuevoUsuario);
    const token = await registrarUsuario(nuevoUsuario);

    if (token) {
      setUsuarioActivo(nuevoUsuario);
      setToken(token);
      console.log("Nuevo usuario activo: " + usuario?.nombre)
    }
  };

  useEffect(() => {
    console.log("✅ Register montado");
  }, []);

  return (
    <div className={style.containerPrincipalRegister}>
      <div>
        <Header />
      </div>
      <div className={style.containerForm}>
        <h2>REGISTER</h2>
        <>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              rol: "CLIENTE",
            }}
            onSubmit={(values: any) => {
              handleSubmit(values);
            }}
            validationSchema={schemaYup}
          >
            {({ values, errors, touched }) => {
              console.log("errors:", errors, "touched:", touched);
              return (
                <>
                  <Form className={style.Form}>
                    <div className={style.Input}>
                      <Field
                        className={style.Field}
                        type="text"
                        name="name"
                        id="name"
                        placeholder=" Name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className={style.Input}>
                      <Field
                        className={style.Field}
                        type="email"
                        name="email"
                        id="email"
                        placeholder=" Email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className={style.Input}>
                      <Field
                        className={style.Field}
                        type="password"
                        name="password"
                        id="password"
                        placeholder=" Password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className={style.Input}>
                      <Field name="rol">
                        {({ field, form }: { field: any; form: any }) => (
                          <div className={style.rolToggle}>
                            <span>Usuario: </span>
                            <button
                              type="button"
                              className={`${style.rolButton} ${
                                field.value === "ADMIN" ? style.active : ""
                              }`}
                              onClick={() => form.setFieldValue("rol", "ADMIN")}
                            >
                              ADMIN
                            </button>
                            <button
                              type="button"
                              className={`${style.rolButton} ${
                                field.value === "CLIENTE" ? style.active : ""
                              }`}
                              onClick={() =>
                                form.setFieldValue("rol", "CLIENTE")
                              }
                            >
                              CLIENTE
                            </button>
                          </div>
                        )}
                      </Field>
                    </div>
                    <button type="submit" className={style.buttonSend}>
                      Send
                    </button>
                    {<pre>{JSON.stringify(values, null, 2)}</pre>}
                  </Form>
                </>
              );
            }}
          </Formik>
          {/*<pre>{JSON.stringify(localStore, null, 2)}</pre>*/}
        </>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
