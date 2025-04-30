import { Footer } from "../../ui/Footer/Footer"
import { Header } from "../../ui/Header/Header"
import { Showcase } from "../../ui/Showcase/Showcase"
import style from '../GenericStyle.module.css'


export const Catalog = () => {
  return (
    <div className={style.containerPrincipalPage}>
        <Header/>
        <div className={style.containerProducts}>
            <Showcase/>
            <Showcase/>
            <Showcase/>
            <Showcase/>
            <Showcase/>
            <Showcase/>
        </div>
        <Footer/>
    </div>
  )
}
