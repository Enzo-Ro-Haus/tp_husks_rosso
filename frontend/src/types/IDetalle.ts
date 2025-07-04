import { IProducto } from "./IProducto";
import { IOrden } from "./IOrden";

export interface IDetalle {
  id?: number;
  cantidad: number;
  producto: IProducto;
  ordenDeCompra: IOrden;
  activo?: boolean;
}