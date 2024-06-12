import { Ubigeo } from "./ubigeo.model";
import { Usuario } from "./usuario.model";

export class Coordenada {

  idCoordenada?: number;
  latitud?: number | null;
  longitud?: number | null;
  prestatario?: Usuario;
  ubigeo?: Ubigeo;
  fechaRegistro?: Date;
  fechaActualizacion?: Date;
  usuarioRegistro?: Usuario;
  usuarioActualiza?: Usuario

}
