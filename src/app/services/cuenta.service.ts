import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuenta } from '../models/cuenta.model';
import { AppSettings } from '../app.settings';
import { EntidadFinanciera } from '../models/entidad-financiera.model';

// const urlRegistro = AppSettings.API_ENDPOINT+ '/cuenta'

const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/cuenta';
const urlCrud = AppSettings.API_ENDPOINT + '/crud/cuenta';



@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  constructor(private http:HttpClient) { }

  // PC1
  registrar(data:Cuenta):Observable<any>{
    return this.http.post(baseUrlPrueba, data);
  }

  validaNumeroRegistra(numero: string): Observable<any>{
    return this.http.get<any>(baseUrlPrueba + '/validaNumeroRegistra?numero=' + numero);
  }

  listar(idDataCatalogo?: any):Observable<EntidadFinanciera[]>{
    return this.http.get<EntidadFinanciera[]>(baseUrlPrueba + "/listarEF?idDataCatalogo=" + idDataCatalogo);
  }

  // Validacion - PC2
  validaNumeroActualiza(numero: string, id: number): Observable<any>{
    // http://localhost:8090/url/crud/cuenta/validaNumeroActualiza/12345678912345678931/24
    return this.http.get<any>(urlCrud + '/validaNumeroActualiza/ ' + numero + '/' + id);
  }

  // PC2
  insert(cuenta: Cuenta): Observable<any> {
    return this.http.post(urlCrud + "/insert", cuenta);
  }

  update(cuenta: Cuenta): Observable<any> {
    return this.http.put(urlCrud + "/update", cuenta);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(urlCrud + "/delete/" + id);
  }

  consultar(filter: string): Observable<any> {
    return this.http.get(urlCrud + "/list/" + filter);
  }

}
