import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { DataCatalogo } from '../models/dataCatalogo.model';

const baseUrl = AppSettings.API_ENDPOINT + '/datacatalogo';

@Injectable({
  providedIn: 'root'
})
export class DataCatalogoService {

  constructor(private http: HttpClient) { }
  listaCatalogo(): Observable<any> {
    return this.http.get(baseUrl + '/listarCatalogo', {});
  }

  listaDataCatalogo(): Observable<any> {
    return this.http.get(baseUrl + '/listar', {});

  }

  registrarDataCatalogo(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  validaDescripcionRegistra(descripcion: string): Observable<any>{
    console.log('>>> Service >> validarCatalogoRegistro [inicio]' + descripcion);
    return this.http.get<any>(baseUrl+'/validarCatalogoRegistro?descripcion='+descripcion);
  }
}
