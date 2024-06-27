import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prestatario } from '../models/prestatario.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/prestatario';
const baseUrlCrud = AppSettings.API_ENDPOINT + '/crudPrestatario'; //T2
const baseUrlConsulta = AppSettings.API_ENDPOINT + '/consultaPrestatario'

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
  //T2
  validaElLoginActualiza(login: string, id: number): Observable<any> {
    console.log('>>> Service >> validaLoginRegistra [inicio]' + login);
    return this.http.get<any>(baseUrlCrud + '/validaLoginActualiza?login=' + login + "&idUsuario=" + id);
  }

  validaElDniActualiza(dni: string, id: number): Observable<any> {
    console.log('>>> Service >> validaDniRegistra [inicio]' + dni);
    return this.http.get<any>(baseUrlCrud + '/validaDniActualiza?dni=' + dni + "&idUsuario=" + id);
  }

  registrarPrestatarioCrud(data: Prestatario): Observable<any> {
    return this.http.post(baseUrlCrud + "/registrarPrestatario", data);
  }
  actualizaPrestatarioCrud(data: Prestatario): Observable<any> {
    return this.http.put(baseUrlCrud + "/actualizaPrestatario", data);
  }
  eliminarPrestatarioCrud(id: number): Observable<any> {
    return this.http.delete(baseUrlCrud + "/eliminarPrestatario/" + id);
  }
  consultarPrestatarioCrud(filtro: string, id: number): Observable<any> {
    return this.http.get(baseUrlCrud + "/listaPrestatarioPorLogin/" + filtro + "/" + id);
  }
  //EF
  consultaPrestatarioCompleja(nombres: string, apellidos: string, dni: string, direccion: string): Observable<any> {

    const consulta = `${baseUrlConsulta}/consultaPrestatarioCompleja?nombres=${nombres}&apellidos=${apellidos}&dni=${dni}&direccion=${direccion}`;
    return this.http.get<any>(consulta);

  }
}