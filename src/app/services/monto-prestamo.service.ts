import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MontoPrestamo } from '../models/monto-prestamo.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';


const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/monto';

@Injectable({
  providedIn: 'root'
})
export class MontoPrestamoService {

  constructor(private http:HttpClient) { }

  registrar(data:MontoPrestamo):Observable<any>{
    return this.http.post(baseUrlPrueba, data);
  }
}
