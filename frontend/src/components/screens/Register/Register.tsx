import { ErrorMessage, Field, Form, Formik } from "formik";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./Register.module.css";
import * as yup from "yup";
import { usuarioStore } from "../../../store/usuarioStore";
import { registrarUsuario } from "../../../http/usuarioHTTP";
import { IUsuario } from "../../../types/IUsuario";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

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
}

export const Register = () => {
  const navigate = useNavigate();

  const setUsuarioActivo = usuarioStore((state) => state.setUsuarioActivo);
  const setToken = usuarioStore((state) => state.setToken);
  const usuario = usuarioStore((state) => state.usuarioActivo);
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  const handleSubmit = async (values: IValues) => {
    const nuevoUsuario: IUsuario = {
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
    };

    const info = await registrarUsuario(nuevoUsuario);

    if (info?.token) {
      setToken(info.token);
      if (info.usuario) {
        setUsuarioActivo({ ...info.usuario, token: info.token });
      } else {
        // Usuario no viene, solo guardamos token
        setUsuarioActivo({ token: info.token } as IUsuario);
      }
      navigate("/");
    } else {
      console.warn("❌ Registro fallido");
    }
  };

  useEffect(() => {
    console.log("✅ Register montado");
    if (token) {
      navigate("/");
    }
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
                    <button type="submit" className={style.buttonSend}>
                      Send
                    </button>
                    {/*<pre>{JSON.stringify(values, null, 2)}</pre>*/}
                  </Form>
                </>
              );
            }}
          </Formik>
          {/*<pre>{JSON.stringify(localStore, null, 2)}</pre>*/}
        </>
        <p>
          Don't have an account?{" "}
          <Link to="/login">
            <b>Login</b>
          </Link>
        </p>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
