import { IDetalle } from "./IDetalle";
import { IUserDir } from "./IUserDir";

export interface IOrden {
    id: number,
    direccion: IUserDir,
    detalle: IDetalle,
    fecha: Date,
    total: number,
    metodoPago: string,
    estado: string,
}