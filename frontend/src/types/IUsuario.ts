import { Rol } from "./enums/Rol";
import { IUsuarioDireccion } from "./IUsuarioDireccion";
import { IOrden } from "./IOrden";

export interface IUsuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol?: Rol;
  direcciones?: IUsuarioDireccion[];
  ordenes?: IOrden[];
  token?: string | null;
  activo?: boolean;
  imagenPerfilPublicId?: string;
}

export interface ILogUsuario {
  email: string;
  password: string;
}


export interface IAuthResponse {
  token: string;
  usuario: IUsuario;
}

export interface IValues {
  nombre: string;
  email: string;
  password: string;
}