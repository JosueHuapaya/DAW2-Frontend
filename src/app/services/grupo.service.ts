import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Grupo } from '../models/grupo.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/grupo';
const baseUrlCrudGrupo = AppSettings.API_ENDPOINT + '/crudGrupo';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private http:HttpClient) { }

  registrar(data:Grupo):Observable<any>{
    return this.http.post(baseUrlPrueba, data);
  }
  validaDescripcionRegistra(descripcion: string): Observable<any>{
    console.log('>>> Service >> validaDescripcionRegistra [inicio]' + descripcion);
    return this.http.get<any>(baseUrlPrueba+'/validaDescripcionRegistra?descripcion='+descripcion);
  }
  validaDescripcionActualiza(descripcion: string, id:number): Observable<any>{
    console.log('>>> Service >> validaDescripcionActualiza [inicio]' + descripcion);
    return this.http.get<any>(baseUrlCrudGrupo+'/validaDescripcionActualiza?descripcion='+descripcion + "&idEjemplo="+id);
  }

  registrarCrud(data:Grupo):Observable<any>{
    return this.http.post(baseUrlCrudGrupo+"/registraGrupo", data);
  }
  actualizarCrud(data:Grupo):Observable<any>{
    return this.http.put(baseUrlCrudGrupo+"/actualizaGrupo", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudGrupo+"/eliminaGrupo/"+id);
  }

 consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudGrupo+"/listaGrupoPorNombreLike/"+ filtro);
  }
  
}
