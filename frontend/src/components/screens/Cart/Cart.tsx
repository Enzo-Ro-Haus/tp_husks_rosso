import { useNavigate } from "react-router"
import { CartSideBar } from "../../ui/CartSideBar/CartSideBar"
import { Footer } from "../../ui/Footer/Footer"
import { Header } from "../../ui/Header/Header"
import { ShowElements } from "../../ui/ShowElements/ShowElements"
import styles from "./Cart.module.css"
import { useEffect } from "react"
import { usuarioStore } from "../../../store/usuarioStore"

export const Cart = () => {

  const navigate = useNavigate();
  const token = usuarioStore((s) => s.usuarioActivo?.token);

  useEffect(() => {
    if (!token) {
      console.warn("No hay token");
      navigate("/login");
    }
  }, []);
  return (
    <div className={styles.containerPrincipalCart}>
        <Header/> 
        <div className={styles.containerBody}>
          <ShowElements />
          <CartSideBar />
        </div>
        <Footer/>
    </div>
  )
}