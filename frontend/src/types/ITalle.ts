import { IProducto } from "./IProducto";
import { SistemaTalle } from "./enums/SistemaTalle";

export interface ITalle {
  id?: number;
  sistema: SistemaTalle;
  valor: string;
  productos?: IProducto[];
  activo?: boolean;
}
