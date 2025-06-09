import { IDetalle } from "../../../../types/IDetalle";
import { ITalle } from "../../../../types/ITalle";
import { ITipo } from "../../../../types/ITipo";
import style from "./ListCard.module.css";

type ListCardProps = {
  variant: "Products" | "Users" | "Categories" | "Types" | "Sizes" | "Addresses" | "Orders";
  id?: number;
  // Producto
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  sizes?: ITalle[];
  // Props for usuario
  email?: string;
  rol?: string;
  //Categoria 
  type?: ITipo;
  //Talle
  system?: string;
  value?: string;
  //Direccion
  street?: string,
  locality?: string,
  pc?: number,
  //Orden
  detail?: IDetalle,
  date?: Date,
  total?: number,
  payMethod?: string,
  Dstatus?: string,
};

export const ListCard = ({
  variant,
  id,
  name,
  description,
  price,
  quantity,
  sizes,
  email,
  rol,
  type,
  system,
  value,
  street,
  locality,
  pc,
  detail,
  date,
  total,
  payMethod,
  Dstatus,
}: ListCardProps) => {
  if (variant === "Products") {
    return (
      <div className={style.containerPrincipalListCard}>
        <div className={style.ListCard}>
          <img
            className={style.listCardImg}
            src={"/src/assets/landings/image.png"}
            alt={name}
          />
          <div className={style.ClotheInfo}>
            <div className={style.ClotheDetail}>
              <p>
                <b>ID: </b>
                {id}
              </p>
              <p>
                <b>Name: </b>
                {name}
              </p>
              <p>
                <b>Description: </b>
                {description}
              </p>
              {sizes && sizes.length > 0 && (
                <p>
                  <b>Sizes: </b>
                </p>
              )}
              <p>
                <b>Price: $</b>
                {price}
              </p>
              <p>
                <b>Stock:</b> {quantity}
              </p>
            </div>
          </div>
          <div className={style.Botones}>
            <button className={style.CardButtons}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className={style.CardButtons}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }else if (variant === "Users") {
    return (
      <div className={style.containerPrincipalListCardUsuario}>
        <div className={style.ListCardUsuario}>
          <img
            className={style.listCardImgUsuario}
            src={"src/assets/user_img.jpg"}
            alt={name}
          />
          <div className={style.ClotheInfoUsuario}>
            <div className={style.ClotheDetailUsuario}>
              <p>
                <b>ID:</b> {id}
              </p>
              <p>
                <b>Name:</b> {name}
              </p>
              <p>
                <b>Email:</b> {email}
              </p>
              <p>
                <b>Role:</b> {rol?.toLocaleLowerCase()}
              </p>
            </div>
            <div className={style.ClotheDetailUsuarioDireccion}>
              <p>
                <b>Adress:</b> {/*direccion*/}
              </p>
            </div>
          </div>
          <div className={style.BotonesUsuario}>
            <button className={style.CardButtonsUsuario}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className={style.CardButtonsUsuario}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else if(variant === "Categories"){
    return (
    <div className={style.containerPrincipalListCardCategoria}>
        <div className={style.ListCardCategoria}>
          <div className={style.ClotheInfoCategoria}>
            <div className={style.ClotheDetailCategoria}>
              <p>
                <b>ID:</b> {id}
              </p>
              <p>
                <b>Name:</b> {name}
              </p>
              <p>
                <b>Type:</b> {/*type*/}
              </p>
            </div>
          </div>
          <div className={style.BotonesCategoria}>
            <button className={style.CardButtonsCategoria}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className={style.CardButtonsCategoria}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }else if(variant === "Types"){
    return (
    <div className={style.containerPrincipalListCardTipo}>
        <div className={style.ListCardTipo}>
          <div className={style.ClotheInfoTipo}>
            <div className={style.ClotheDetailTipo}>
              <p>
                <b>ID:</b> {id}
              </p>
              <p>
                <b>Name:</b> {name}
              </p>
            </div>
          </div>
          <div className={style.BotonesTipo}>
            <button className={style.CardButtonsTipo}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className={style.CardButtonsTipo}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else if(variant === "Sizes"){
    return (
    <div className={style.containerPrincipalListCardTipo}>
        <div className={style.ListCardTipo}>
          <div className={style.ClotheInfoTipo}>
            <div className={style.ClotheDetailTipo}>
              <p>
                <b>ID:</b> {id}
              </p>
              <p>
                <b>System:</b> {system}
              </p>
              <p>
                <b>Value:</b> {value}
              </p>
            </div>
          </div>
          <div className={style.BotonesTipo}>
            <button className={style.CardButtonsTipo}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className={style.CardButtonsTipo}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else if(variant === "Addresses"){
    return (
    <div className={style.containerPrincipalListCardDireccion}>
        <div className={style.ListCardDireccion}>
          <div className={style.ClotheInfoDireccion}>
            <div className={style.ClotheDetailDireccion}>
              <p>
                <b>ID:</b> {id}
              </p>
              <p>
                <b>Street:</b> {street}
              </p>
              <p>
                <b>Locality:</b> {locality}
              </p>
              <p>
                <b>Postal Code:</b> {pc}
              </p>
            </div>
          </div>
          <div className={style.BotonesDireccion}>
            <button className={style.CardButtonsDireccion}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className={style.CardButtonsDireccion}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
    } else if(variant === "Orders"){
    return (
    <div className={style.containerPrincipalListCardOrdenes}>
        <div className={style.ListCardOrdenes}>
          <div className={style.ClotheInfoOrdenes}>
            <div className={style.ClotheDetailOrdenes}>
              <p>
                <b>ID:</b> {id}
              </p>
              <p>
                <b>Detail</b> {/*detail*/}
              </p>
              <p>
                <b>Date</b> {/*date*/}
              </p>
              <p>
                <b>Total:</b> {total}
              </p>
              <p>
                <b>Payment method</b> {payMethod}
              </p>
              <p>
                <b>Delivery status</b> {Dstatus}
              </p>
            </div>
          </div>
          <div className={style.BotonesOrdenes}>
            <button className={style.CardButtonsOrdenes}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className={style.CardButtonsOrdenes}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
};
