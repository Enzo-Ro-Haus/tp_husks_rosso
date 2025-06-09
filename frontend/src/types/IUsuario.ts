import { IDireccion } from "./IDireccion";
import { IOrdenDeCompra } from "./IOrden";

export interface IUsuario {
    id?: number,
    nombre: string,
    email: string,
    contrasenia: string,
    rol: "ADMIN" | "CLIENTE",
    direcciones?: IDireccion,
    ordenes?: IOrdenDeCompra,
    token?: string | null,
}