import style from "./ListCard.module.css";

export const ListCard = () => {
  return (
    <div className={style.containerPrincipalListCard}>
      <div className={style.ListCard}>
        <img className={style.listCardImg} src={"/src/assets/landings/image.png"}></img>
        <div className={style.ClotheInfo}>
          <h4 className={style.ClotheInfoTitle}>Nombre de la prenda</h4>
          <div className={style.ClotheDetail}>
            <p>Size: </p>
            <p>Color: </p>
          </div>
        </div>
        <div className={style.buttonQuantity}>
            <button> +  4  - </button>
        </div>
        <div className={style.ClothePrice}>
          <p className={style.Price}>$40</p>
        </div>
        <div className={style.Botones}>
          <button className={style.CardButtons}><span className="material-symbols-outlined">
edit
</span></button>
          <button className={style.CardButtons}><span className="material-symbols-outlined">
delete
</span></button>
        </div>
      </div>
    </div>
  );
};
