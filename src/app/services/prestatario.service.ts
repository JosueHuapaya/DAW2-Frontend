import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prestatario } from '../models/prestatario.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/prestatario';

@Injectable({
  providedIn: 'root'
})
export class PrestatarioService {

  constructor(private http:HttpClient) { }

  registrar(data:Prestatario):Observable<any>{
    console.log("PRUEBA DE SERVICE PRESTATARIO");
    console.log(data.direccion);
    return this.http.post(baseUrlPrueba,data);
  }

  validaLoginRegistra(login: string): Observable<any>{
    console.log('>>> Service >> validaLoginRegistra [inicio]' + login);
    return this.http.get<any>(baseUrlPrueba+'/validaLoginRegistra?login='+login);
  }

  validaDniRegistra(dni: string): Observable<any>{
    console.log('>>> Service >> validaDniRegistra [inicio]' + dni);
    return this.http.get<any>(baseUrlPrueba+'/validaDniRegistra?dni='+dni);
  }


}