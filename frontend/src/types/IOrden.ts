import { IUsuario } from "./IUsuario";
import { IUsuarioDireccion } from "./IUsuarioDireccion";
import { IDetalle } from "./IDetalle";
import { EstadoOrden } from "./enums/EstadoOrden";
import { MetodoPago } from "./enums/MetodoPago";

export interface IOrden {
  id?: number;
  usuario: IUsuario;
  usuarioDireccion: IUsuarioDireccion;
  fecha: string; // ISO date string
  precioTotal: number;
  metodoPago: MetodoPago;
  estado: EstadoOrden;
  detalles: IDetalle[];
  preferenceId?: string;
  activo?: boolean;
}