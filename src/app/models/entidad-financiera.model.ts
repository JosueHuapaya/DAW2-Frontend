import { DataCatalogo } from "./dataCatalogo.model";
import { Ubigeo } from "./ubigeo.model";
import { Usuario } from "./usuario.model";

export class EntidadFinanciera {

    idEntidadFinanciera?: number;
    nombre?: string;
    gerente?: string;
    tipoEntidad?: DataCatalogo;
    ubigeo?: Ubigeo;
    estado?: number;
    fechaRegistro?: Date;
    fechaActualizacion?: Date;
    usuarioRegistro?: Usuario;
    usuarioActualiza?: Usuario;
    
}
