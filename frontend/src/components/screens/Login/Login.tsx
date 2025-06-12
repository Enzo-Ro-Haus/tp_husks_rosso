import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./Login.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usuarioStore } from "../../../store/usuarioStore";
import { ILogUsuario } from "../../../types/IUsuario";
import { loginUsuario } from "../../../http/usuarioHTTP";

const schemaYup = yup.object().shape({
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

export const Login = () => {
  const navigate = useNavigate();
  const token = usuarioStore((s) => s.usuarioActivo?.token);
  const setUsuarioActivo = usuarioStore((state) => state.setUsuarioActivo);
  const setToken = usuarioStore((s) => s.setToken);

  const [localStore, setLocalStore] = useState({});

  const handleSubmit = async (values: IValues) => {
    const nuevoUsuario: ILogUsuario = {
      email: values.email.trim(),
      password: values.password.trim(),
    };

    const info = await loginUsuario(nuevoUsuario.email, nuevoUsuario.password);

    if (info?.token && info?.usuario) {
      setToken(info.token);
      setUsuarioActivo({ ...info.usuario, token: info.token });
      navigate("/"); // navego luego de guardar
    } else {
      console.warn("❌ Login fallido");
    }
    setLocalStore(values);
  };

  useEffect(() => {
    console.log("✅ Login montado");
    if (token) {
      navigate("/");
    }
  }, []);
  return (
    <div className={style.containerPrincipalLogin}>
        <Header />
      <div className={style.containerForm}>
        <h2>LOGIN</h2>
        <>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values: any) => {
              console.log(values);
              handleSubmit(values);
            }}
            validationSchema={schemaYup}
          >
            {({ values }) => (
              <>
                <Form className={style.Form}>
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
                  {/*<pre>{JSON.stringify(values, null, 2)}</pre>+*/}
                </Form>
              </>
            )}
          </Formik>
          {/*<pre>{JSON.stringify(localStore, null, 2)}</pre>*/}
        </>
        <p>
          Don't have an account?{" "}
          <Link to="/register">
            <b>Register</b>
          </Link>
        </p>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
