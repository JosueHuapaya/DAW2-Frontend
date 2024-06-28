import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { DataCatalogo } from '../models/dataCatalogo.model';

const baseUrl = AppSettings.API_ENDPOINT + '/datacatalogo';
const baseCrudUrl = AppSettings.API_ENDPOINT + '/crudDataCatalogo';
const baseUrlConsultaDataCatalogo = AppSettings.API_ENDPOINT + '/consultaDataCatalogo';
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
  validaDescripcionActualiza(id: number, descripcion: string): Observable<any>{
    console.log('>>> Service >> validarCatalogoActualiza [inicio]' + descripcion);
    return this.http.get<any>(baseUrl+'/validaDescripcionActualiza?id='+id+'&descripcion='+descripcion);
  }
  //CRUD
  actualizarDataCatalogo(data: DataCatalogo): Observable<any> {
    console.log('>>> Service >> validarCatalogoActualiza [inicio]');
    return this.http.put(baseCrudUrl+"/actualizarDataCatalogo", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseCrudUrl+"/eliminaDataCatalogo/"+id);
  }
  registrarCrud(data:DataCatalogo):Observable<any>{
    return this.http.post(baseCrudUrl+"/insertarDataCatalogo", data);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseCrudUrl+"/listaDataCatalogoPorNombreLike/"+ filtro);
  }
  //consulta
  consultaDataCatlogo(descripcion: string,  estado: number,idCatalogo:number): Observable<any>{
    console.log('>>> Service >> consultaDataCatalogo [inicio]' + descripcion);
    return this.http.get<any>(baseUrlConsultaDataCatalogo+'/listaConsultaComplejaDataCatalogo?descripcion='+descripcion + "&estado="+estado +"&idCatalogo="+idCatalogo);
  }
}
