import { DataCatalogo } from "./dataCatalogo.model";
import { Usuario } from "./usuario.model";

export class SolicitudPrestamo {
    idSolicitud?: number;
    capital?:number; 
    dias?: DataCatalogo;
    montoPagar?: number;
    fechaInicioPrestamo?: Date | null;
    fechaFinPrestamo?: Date | null;
    usuarioPrestatario?:Usuario;
    estado?:number;
    usuarioRegistro?:Usuario;
    usuarioActualiza?:Usuario;
}
