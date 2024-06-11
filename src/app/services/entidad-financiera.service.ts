import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntidadFinanciera } from '../models/entidad-financiera.model';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';

const urlRegistro = AppSettings.API_ENDPOINT+ '/EntidadFinancieraRegistro'

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

}

