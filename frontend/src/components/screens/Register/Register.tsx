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
import Swal from "sweetalert2";
import { showErrorAlert } from "../../../utils/errorHandler";

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
  imagenPerfilPublicId: yup.string().optional(),
  direcciones: yup.array().of(yup.object({
    calle: yup.string().required(),
    localidad: yup.string().required(),
    cp: yup.string().required()
  })).optional(),
  nuevaDireccionCalle: yup.string().optional(),
  nuevaDireccionLocalidad: yup.string().optional(),
  nuevaDireccionCP: yup.string().optional(),
});

const DEFAULT_IMAGE_PUBLIC_ID = "user_img"; // Debe existir en Cloudinary

export const Register = () => {
  const navigate = useNavigate();

  const setUsuarioActivo = usuarioStore((s) => s.setUsuarioActivo);
  const setToken = usuarioStore((s) => s.setToken);
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  // Si ya hay token, redirige al home
  useEffect(() => {
    if (token) {
      const usuario = usuarioStore.getState().usuarioActivo;
      if (usuario?.rol === "ADMIN") {
        navigate("/admin");
      } else if (usuario?.rol === "CLIENTE") {
        navigate("/client");
      } else {
        navigate("/");
      }
    }
  }, [token, navigate]);

  const handleSubmit = async (values: { 
    nombre: string; 
    email: string; 
    password: string; 
    imagenPerfilPublicId?: string;
    direcciones?: any[];
    nuevaDireccionCalle?: string;
    nuevaDireccionLocalidad?: string;
    nuevaDireccionCP?: string;
  }) => {
    // Mapeo del campo 'name' a 'nombre' en tu DTO
    const nuevoUsuario: IUsuario = {
      nombre: values.nombre.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
      imagenPerfilPublicId: values.imagenPerfilPublicId && values.imagenPerfilPublicId.trim() !== "" 
        ? values.imagenPerfilPublicId 
        : undefined,
      direcciones: values.direcciones || []
    };

    try {
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
        showErrorAlert(null, "Error de registro");
      }
    } catch (error: any) {
      console.error("❌ Error en registro:", error);
      showErrorAlert(error, "Error de registro");
    }
  };

  return (
    <div className={style.containerPrincipalRegister}>
      <Header />

      <div className={style.containerForm}>
        <h2>REGISTER</h2>
        <Formik
          initialValues={{ 
            nombre: "", 
            email: "", 
            password: "", 
            imagenPerfilPublicId: "",
            direcciones: [],
            nuevaDireccionCalle: "",
            nuevaDireccionLocalidad: "",
            nuevaDireccionCP: ""
          }}
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

              {/* Sección de direcciones */}
              <div className={style.Input}>
                <label className={style.Label}>Direcciones (opcional)</label>
                <div className={style.AddressSection}>
                  {values.direcciones && values.direcciones.length > 0 ? (
                    values.direcciones.map((direccion: any, index: number) => (
                      <div key={index} className={style.AddressItem}>
                        <span className={style.AddressText}>
                          <strong>Address {index + 1}:</strong> {direccion.calle}, {direccion.localidad} ({direccion.cp})
                        </span>
                        <button
                          type="button"
                          className={style.RemoveAddressButton}
                          onClick={() => {
                            const newDirecciones = values.direcciones.filter((_: any, i: number) => i !== index);
                            setFieldValue("direcciones", newDirecciones);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className={style.NoAddresses}>No address added</p>
                  )}
                  
                  <div className={style.AddAddressSection}>
                    <div className={style.AddressFields}>
                      <Field
                        className={style.AddressField}
                        type="text"
                        name="nuevaDireccionCalle"
                        placeholder="Calle"
                      />
                      <Field
                        className={style.AddressField}
                        type="text"
                        name="nuevaDireccionLocalidad"
                        placeholder="Localidad"
                      />
                      <Field
                        className={style.AddressField}
                        type="text"
                        name="nuevaDireccionCP"
                        placeholder="CP"
                      />
                      <button
                        type="button"
                        className={style.AddAddressButton}
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
                      </button>
                    </div>
                  </div>
                </div>
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
