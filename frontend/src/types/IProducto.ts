import { ICategoria } from "./ICategoria";
import { ITalle } from "./ITalle";

export interface IProducto {
    id?: number,
    nombre: string,
    cantidad: number,
    precio: number,
    color: string,
    talles: ITalle[],
    categoria: ICategoria,
    descripcion: string,
}