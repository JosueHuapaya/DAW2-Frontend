import { Usuario } from "./usuario.model";

export class Prestatario {

    idUsuario?: number;
    nombres?: string;
    apellidos?: string;
    dni?: string;
    login?: string;
    correo?: string;
    estado?: number;
    fechaNacimiento?: Date;
    direccion?: string;
    usuarioSuperior?:number;
    usuarioRegistro?:number;
    usuarioActualiza?:number;
}
  