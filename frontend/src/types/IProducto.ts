import { ICategoria } from "./ICategoria";
import { ITalle } from "./ITalle";
import { ITipo } from "./ITipo";

export interface IProducto {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
  descripcion?: string;
  color?: string;
  categoria: ICategoria;
  tipo: ITipo;
  tallesDisponibles: ITalle[];
  activo?: boolean;
  imagenPublicId?: string;
}