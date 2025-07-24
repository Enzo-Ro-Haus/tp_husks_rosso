import style from './MercadoLibre.module.css'
import React from 'react';

export const MercadoLibreButton = ({ onClick, disabled = false, style: customStyle }: { onClick: () => void, disabled?: boolean, style?: React.CSSProperties }) => {
  return (
    <button className={style.buttonMercadoLibre} onClick={onClick} disabled={disabled} style={customStyle}>
      <img src="src/assets/landings/MP_RGB_HANDSHAKE_color-blanco_hori-izq.png" alt="logo de mercadopago" />
    </button>
  )
}
