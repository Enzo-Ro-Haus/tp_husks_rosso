import style from './ListAdminProduct.module.css'

export const ListAdminProduct = () => {
  return (
    <div className={style.containerPrincipalListAdminProduct}>
        <div className={style.productInfo}>
            <p>PRODUCT</p>
            <p>STOK</p>
            <p>PRICE</p>
            <p>DISCOUNT</p>
        </div>
        <div className={style.separatorList}></div>
        <div className={style.containerListAdminProduct}>

        </div>
    </div>
  )
}
