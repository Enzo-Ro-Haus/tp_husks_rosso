import { Catalog } from "./components/screens/Catalog/Caralog"
import { Landingpage } from "./components/screens/Landing/Landingpage"
import { Login } from "./components/screens/Login/Login"
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotFound } from "./components/screens/NotFound/NotFound";

const router = createBrowserRouter([
  {path:"/", element: <Landingpage/>},
  {path:"/catalog", element: <Catalog/>},
  {path:"/login", element: <Login/>},
  {path:"*", element: <NotFound/>},
]);


function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
