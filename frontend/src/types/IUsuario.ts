import { IDireccion } from "./IDireccion";
import { IOrden } from "./IOrden";

export interface IUsuario {
    id?: number,
    name: string,
    email: string,
    password: string,
    rol?: "ADMIN" | "CLIENTE",
    direcciones?: IDireccion,
    ordenes?: IOrden,
    token?: string | null,
}

export interface ILogUsuario {
    email: string,
    password: string,
}

export interface IAuthResponse {
  token: string;
  usuario: IUsuario;
}