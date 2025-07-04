import { Catalog } from "./components/screens/Catalog/Caralog";
import { Landingpage } from "./components/screens/Landing/Landingpage";
import { Login } from "./components/screens/Login/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotFound } from "./components/screens/NotFound/NotFound";
import { Admin } from "./components/screens/Admin/Admin";
import { Register } from "./components/screens/Register/Register";
import { Cart } from "./components/screens/Cart/Cart";
import { AboutUs } from "./components/screens/AboutUs/AboutUs";
import { Client } from "./components/screens/Client/Client";
import { ProtectedRoute } from "./routes/rutasProtegidas";
import 'bootstrap/dist/css/bootstrap.min.css';


const router = createBrowserRouter([
  // Públicas
  { path: "/", element: <Landingpage /> },
  { path: "/catalog", element: <Catalog /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/cart", element: <Cart /> },
  { path: "/about", element: <AboutUs /> },
  { path: "*", element: <NotFound /> },

  //Protegidas
  {
    path: "/admin",
    element: (
      <ProtectedRoute rolesPermitidos={["ADMIN"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client",
    element: (
      <ProtectedRoute rolesPermitidos={["CLIENTE"]}>
        <Client />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
