import { IOrdenDeCompra } from "./IOrdenDeCompra";
import { IProducto } from "./IProducto";

export interface IDetalle {
    id: number,
    cantidad: number,
    producto: IProducto,
    ordenDeCompra: IOrdenDeCompra,
}