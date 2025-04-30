import style from "./ListCard.module.css";

export const ListCard = () => {
  return (
    <div className={style.containerPrincipalListCard}>
      <div className={style.ListCard}>
        <img className={style.listCardImg} src={'/home/enzo/Escritorio/TUP/metodo_chiroli/tp_husks_rosso/frontend/src/assets/landingimgs/image.png'}></img>
        <div className={style.ClotheInfo}>
          <h4>Nombre de la prenda</h4>
          <div className={style.ClotheDetail}>
            <p>Size: </p>
            <p>Color: </p>
          </div>
        </div>
        <div className={style.buttonContainer}>{/*Cantidad */}</div>
        <div className={style.ClothePrice}>
          <p>$40</p>
        </div>
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
};
