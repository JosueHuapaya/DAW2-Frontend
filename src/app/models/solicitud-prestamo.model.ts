import { DataCatalogo } from "./dataCatalogo.model";
import { Usuario } from "./usuario.model";

export class SolicitudPrestamo {
    capital?:number; 
    dias?: DataCatalogo;
    montoPagar?: number;
    fechaInicioPrestamo?: Date | null;
    fechaFinPrestamo?: Date | null;
    usuarioPrestatario?:Usuario;
    usuarioRegistro?:Usuario;
    usuarioActualiza?:Usuario;
}
