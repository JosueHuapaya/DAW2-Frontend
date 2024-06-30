import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudPrestamo } from '../models/solicitud-prestamo.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrl = AppSettings.API_ENDPOINT+ '/solicitud';
const baseUrlCrud = AppSettings.API_ENDPOINT + '/crudSolicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudPrestamoService {

  constructor(private http:HttpClient) { }

  registrar(data:SolicitudPrestamo):Observable<any>{
    return this.http.post(baseUrl, data);
  }

  listaPrestatariosTotales(): Observable<any> {
    return this.http.get(baseUrl + '/prestatarios', {});
  }

  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrud+"/listaSolicitudPorCapLike/"+ filtro);
  }

  actualizarCrud(data:SolicitudPrestamo):Observable<any>{
    console.log(data)
    return this.http.put(baseUrlCrud+"/actualizaSolicitud", data);
  }

  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrud+"/eliminaSolicitud/"+id);
  }
}
