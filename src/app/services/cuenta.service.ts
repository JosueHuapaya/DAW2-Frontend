import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuenta } from '../models/cuenta.model';
import { AppSettings } from '../app.settings';
import { EntidadFinanciera } from '../models/entidad-financiera.model';

// const urlRegistro = AppSettings.API_ENDPOINT+ '/cuenta'

const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/cuenta';



@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  constructor(private http:HttpClient) { }

  registrar(data:Cuenta):Observable<any>{
    return this.http.post(baseUrlPrueba, data);
  }

  validaNumeroRegistra(numero: string): Observable<any>{
    console.log('>>> Service >> validaNumeroRegistra [inicio]' + numero);
    return this.http.get<any>(baseUrlPrueba + '/validaNumeroRegistra?numero=' + numero);
  }

  //
  listar(idDataCatalogo?: any):Observable<EntidadFinanciera[]>{
    return this.http.get<EntidadFinanciera[]>(baseUrlPrueba + "/listarEF?idDataCatalogo=" + idDataCatalogo);
  }


}
