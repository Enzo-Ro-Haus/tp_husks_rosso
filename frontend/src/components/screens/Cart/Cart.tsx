import { CartSideBar } from "../../ui/CartSideBar/CartSideBar"
import { Footer } from "../../ui/Footer/Footer"
import { Header } from "../../ui/Header/Header"
import { ShowElements } from "../../ui/ShowElements/ShowElements"
import styles from "./Cart.module.css"

export const Cart = () => {
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