import { Catalogo } from "./catalogo.model";
import { Usuario } from "./usuario.model";

export class DataCatalogo {

    idDataCatalogo?: number;
    descripcion?: string;
    estado?: number;
    catalogo?:Catalogo;
    usuarioPrestatario?:Usuario;
    usuarioRegistro?:Usuario;
}
