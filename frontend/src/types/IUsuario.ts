import { IDireccion } from "./IDireccion";
import { IOrden } from "./IOrden";

export interface IUsuario {
    id?: number,
    nombre: string,
    email: string,
    password: string,
    rol?: "ADMIN" | "CLIENTE",
    direcciones?: IDireccion[],
    ordenes?: IOrden[],
    token?: string | null,
    //active: boolean; <--- Falta aplicar el borrado lógico
}

export interface ILogUsuario {
    email: string,
    password: string,
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