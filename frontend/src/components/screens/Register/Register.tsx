import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom"; 
import { useEffect } from "react";

import { usuarioStore } from "../../../store/usuarioStore";
import { registrarUsuario } from "../../../http/usuarioHTTP";
import { IUsuario } from "../../../types/IUsuario";

import { Header } from "../../ui/Header/Header";  
import { Footer } from "../../ui/Footer/Footer"; 

import style from "./Register.module.css";
import ImageUpload from "../../ui/Image/ImageUpload";
import { uploadImageToCloudinary } from "../../../http/cloudinaryUploadHTTP";

const schemaYup = yup.object().shape({
  nombre: yup
    .string()
    .min(1, "El nombre no puede quedar vacío")
    .required("❌ El nombre es obligatorio"),
  email: yup
    .string()
    .email("Email inválido")
    .required("❌ El email es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("❌ La contraseña es obligatoria"),
});

const DEFAULT_IMAGE_PUBLIC_ID = "user_img"; // Debe existir en Cloudinary

export const Register = () => {
  const navigate = useNavigate();

  const setUsuarioActivo = usuarioStore((s) => s.setUsuarioActivo);
  const setToken = usuarioStore((s) => s.setToken);
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  // Si ya hay token, redirige al home
  useEffect(() => {
   /* if (token) {
      navigate("/");
    }*/
  }, [token, navigate]);

  const handleSubmit = async (values: { nombre: string; email: string; password: string; imagenPerfilPublicId?: string }) => {
    // Mapeo del campo 'name' a 'nombre' en tu DTO
    const nuevoUsuario: IUsuario = {
      nombre: values.nombre.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
      imagenPerfilPublicId: values.imagenPerfilPublicId || DEFAULT_IMAGE_PUBLIC_ID,
    };

    const info = await registrarUsuario(nuevoUsuario);

    if (info?.token) {
      setToken(info.token);
      if (info.usuario) {
        setUsuarioActivo({ ...info.usuario, token: info.token });
      } else {
        setUsuarioActivo({ token: info.token } as IUsuario);
      }
      navigate("/");
    } else {
      console.warn("❌ Registro fallido");
    }
  };

  return (
    <div className={style.containerPrincipalRegister}>
      <Header />

      <div className={style.containerForm}>
        <h2>REGISTER</h2>
        <Formik
          initialValues={{ nombre: "", email: "", password: "", imagenPerfilPublicId: "" }}
          validationSchema={schemaYup}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className={style.Form}>
              <div className={style.Input}>
                <Field
                  className={style.Field}
                  type="text"
                  name="nombre"
                  placeholder="Name"
                />
                <ErrorMessage name="nombre" component="div" className="error-message" />
              </div>
              <div className={style.Input}>
                <Field
                  className={style.Field}
                  type="email"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>
              <div className={style.Input}>
                <Field
                  className={style.Field}
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
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

              <div className={style.containerButtons}>
                <button type="submit" className={style.buttonSend}>
                  Send
                </button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
              </div>

              <pre>{/*JSON.stringify(values, null, 2)*/}</pre>
            </Form>
          )}
        </Formik>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            <b>Login</b>
          </Link>
        </p>
      </div>

      <Footer />
    </div>
  );
};
