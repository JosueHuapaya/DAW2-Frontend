import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntidadFinanciera } from '../models/entidad-financiera.model';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';

const urlRegistro = AppSettings.API_ENDPOINT+ '/EntidadFinancieraRegistro';
const urlCrudEntidadFinanciera = AppSettings.API_ENDPOINT+ '/CrudEntidadFinanciera';
const urlEntidadFinancierConsulta = AppSettings.API_ENDPOINT+ '/consultaEntidadFinanciera';

@Injectable({
  providedIn: 'root'
})
export class EntidadFinancieraService {

  constructor(private http:HttpClient) { }

  registro(entidad:EntidadFinanciera):Observable<any>{
    return this.http.post(urlRegistro,entidad)
  }

  validacionNombre(nombre:String):Observable<any>{
    console.log('>> Service >> validacionNombre[inicio]'+nombre)
    return this.http.get<any>(urlRegistro+'/validaNombreEntidadFinanciera?nombre='+nombre);
  }
//
  listar(idDataCatalogo?:any):Observable<EntidadFinanciera[]>{
    return this.http.get<EntidadFinanciera[]>(urlRegistro+"/listar?idDataCatalogo=" + idDataCatalogo);
  }

  //Validaciones
  validacionNombreActualiza(nombre:String,id:number):Observable<any>{
    console.log('>> Service >> validacionNombre[inicio]'+nombre)
    return this.http.get<any>(urlCrudEntidadFinanciera+'/validarNombreActualizar?nombre='+nombre+ "&idEntidadFinanciera="+id);
  }

  //crud entidad financiera
  registrarCrudEntidad(bean:EntidadFinanciera):Observable<any>{
    return this.http.post(urlCrudEntidadFinanciera+"/registrarEntidadFinanciera", bean);
  }
  actualizaCrudEntidad(bean:EntidadFinanciera):Observable<any>{
    return this.http.put(urlCrudEntidadFinanciera+"/updateEntidadFinanciera", bean);
  }
  eliminarCrudEntidad(id:number):Observable<any>{
    return this.http.delete(urlCrudEntidadFinanciera+"/deleteEntidadFinanciera/"+id);
  }
  consultarCrudEntidad(filter:string):Observable<any>{
    return this.http.get(urlCrudEntidadFinanciera+"/listEntidadFinancieraLike/"+filter);
  }
  EntidadFinancieraConsulta(nombre:string, gerente:string, tipo:number, estado:number):Observable<any>{
    const params = new HttpParams()
        .set("nombre", nombre)
        .set("gerente", gerente)
        .set("idTipo", tipo)
        .set("estado", estado);
    return this.http.get(urlEntidadFinancierConsulta+"/consultaEntidadCompleja",{params})
  }
}

