import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Grupo } from '../models/grupo.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/grupo';

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
}
