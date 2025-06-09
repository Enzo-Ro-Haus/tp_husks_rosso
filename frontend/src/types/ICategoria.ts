import { ITipoCategoria } from "./ITipo";

export interface ICategoria {
    id: number,
    nombre: string,
    tipo?: ITipoCategoria;
}