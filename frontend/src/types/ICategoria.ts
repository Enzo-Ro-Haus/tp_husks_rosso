import { ITipo } from "./ITipo";
import { IProducto } from "./IProducto";

export interface ICategoria {
  id?: number;
  nombre: string;
  tipos: ITipo[];
  productos?: IProducto[];
  activo?: boolean;
}
