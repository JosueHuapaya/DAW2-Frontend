import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudPrestamo } from '../models/solicitud-prestamo.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrl = AppSettings.API_ENDPOINT+ '/solicitud';

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
}
