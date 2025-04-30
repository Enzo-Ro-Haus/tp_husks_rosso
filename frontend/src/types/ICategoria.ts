import { ITipoCategoria } from "./ITipoCategoria";

export interface ICategoria {
    id: number,
    nombre: string,
    tipo: ITipoCategoria;
}