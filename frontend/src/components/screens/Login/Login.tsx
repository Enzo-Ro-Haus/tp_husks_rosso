import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./Login.module.css";
import { useState } from "react";

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

export const Login = () => {
  const [localStore, setLocalStore] = useState({});

  const handleSubmit = (values: IValues) => {
    const { name, email, password } = values;
    values = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    };
    setLocalStore(values);
  };

  return (
    <div className={style.containerPrincipalLogin}>
      <div>
        <Header />
      </div>
      <div className={style.containerForm}>
        <h2>LOGIN</h2>
        <>
          <Formik
            initialValues={{
              name: "",
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
                  {/*<pre>{JSON.stringify(values, null, 2)}</pre>+*/}
                </Form>
              </>
            )}
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
