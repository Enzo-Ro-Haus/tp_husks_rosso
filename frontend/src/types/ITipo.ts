import { ICategoria } from "./ICategoria";

export interface ITipo {
    id?: number,
    nombre: string,
    categorias?: ICategoria[],
}