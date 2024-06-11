import { DataCatalogo } from "./dataCatalogo.model";
import { EntidadFinanciera } from "./entidad-financiera.model";
import { Usuario } from "./usuario.model";

export class Cuenta {
  idCuenta? : number;
  numero? : string;
  entidadFinanciera? : EntidadFinanciera;
  tipoMoneda? : DataCatalogo;
  estado? : number;
  usuarioRegistro? : Usuario;
  usuarioActualiza? : Usuario
}
