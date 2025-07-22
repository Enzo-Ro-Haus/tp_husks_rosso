import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./Login.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuarioStore } from "../../../store/usuarioStore";
import { ILogUsuario } from "../../../types/IUsuario";
import { loginUsuario } from "../../../http/usuarioHTTP";
import Swal from "sweetalert2";
import { showErrorAlert, showSuccessAlert } from "../../../utils/errorHandler";

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

  const [localStore, setLocalStore] = useState({});

  const handleSubmit = async (values: IValues) => {
    const nuevoUsuario: ILogUsuario = {
      email: values.email.trim(),
      password: values.password.trim(),
    };

    console.log("🔄 Iniciando login...");
    
    try {
      const info = await loginUsuario(nuevoUsuario.email, nuevoUsuario.password);
      console.log("📦 Respuesta del login:", info);

      if (info?.token && info?.usuario) {
        console.log("✅ Login exitoso, guardando datos...");
        showSuccessAlert(`Welcome back ${info.usuario.nombre}`);
        // Normalizar el campo rol a string y convertir a Rol si es válido
        let rolNormalizado: any = undefined;
        if (typeof info.usuario.rol === "string") {
          rolNormalizado = info.usuario.rol;
        } else if (info.usuario.rol && typeof info.usuario.rol === "object" && "name" in info.usuario.rol) {
          rolNormalizado = (info.usuario.rol as any).name;
        }
        // Convertir a Rol si es válido
        const rolesValidos = ["ADMIN", "CLIENTE"];
        const rolFinal = rolesValidos.includes(rolNormalizado) ? rolNormalizado : undefined;
        setUsuarioActivo({ 
          ...info.usuario, 
          token: info.token, 
          rol: rolFinal
        });
        console.log("🚀 Redirigiendo según rol...");
        // Redirigir según el rol del usuario
        if (rolFinal === "ADMIN") {
          navigate("/admin");
        } else if (rolFinal === "CLIENTE") {
          navigate("/client");
        } else {
          navigate("/");
        }
      } else {
        console.warn("❌ Login fallido");
        showErrorAlert(null, "Error de login");
      }
    } catch (error: any) {
      console.error("❌ Error en login:", error);
      showErrorAlert(error, "Error de login");
    }
    
    setLocalStore(values);
  };

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
        <Footer />
    </div>
  );
};
