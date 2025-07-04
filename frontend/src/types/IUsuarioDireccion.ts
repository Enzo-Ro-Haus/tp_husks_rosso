import { IUsuario } from "./IUsuario";
import { IDireccion } from "./IDireccion";

export interface IUsuarioDireccion {
  id?: number;
  usuario: IUsuario;
  direccion: IDireccion;
  activo?: boolean;
}