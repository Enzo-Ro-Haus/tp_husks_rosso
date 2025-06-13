import style from './MercadoLibre.module.css'

export const MercadoLibreButton = () => {
  return (
    <button className={style.buttonMercadoLibre}>
      <img src="src/assets/landings/MP_RGB_HANDSHAKE_color-blanco_hori-izq.png" alt="logo of mercadopago" width="150px" height="50px"></img>
    </button>
  )
}
