import { Ubigeo } from "./ubigeo.model";
import { Usuario } from "./usuario.model";

export class Grupo {
    idGrupo?: number;
    descripcion?:string;
    ubigeo?: Ubigeo;
    departamento?:Ubigeo;
    provincia?:Ubigeo;
    distrito?:Ubigeo;
    lider?:Usuario;
    usuarioLider?:Usuario;
    usuarioSuperior?:Usuario;
    usuarioRegistro?: Usuario;
    usuarioActualiza?: Usuario
}
