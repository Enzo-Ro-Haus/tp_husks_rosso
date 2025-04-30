import { IDireccion } from "./IDireccion";

export interface IUsuario {
    id: number,
    nomber: string,
    email: string,
    contrasena: string,
    rol: string,
    direccion: IDireccion,
}