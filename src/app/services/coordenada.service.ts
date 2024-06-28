import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Coordenada } from '../models/coordenada.model';
import { Observable } from 'rxjs';

const baseUrl = AppSettings.API_ENDPOINT + '/coordenadas';
const baseUrlCoordenadaCrud = AppSettings.API_ENDPOINT + '/coordenadaCRUD';
const baseUrlCoordenadaConsulta = AppSettings.API_ENDPOINT + '/consultaCoordenada';


@Injectable({
  providedIn: 'root'
})
export class CoordenadaService {

  constructor(private http: HttpClient) { }

  registrar(data: Coordenada): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  listaPrestamistariosTotales(): Observable<any> {
    return this.http.get(baseUrl + '/prestatarios', {});
  }

  actualizarCoordenada(data: Coordenada): Observable<any> {
    return this.http.put(baseUrlCoordenadaCrud + "/actualizarCoordenada", data);
  }

  eliminarCoordenada(idCoordenada: any): Observable<any> {
    return this.http.delete(baseUrlCoordenadaCrud + "/eliminarCoordenada/" + idCoordenada);
  }

  consultarCoordenada(filtro: any): Observable<any> {
    return this.http.get(baseUrlCoordenadaCrud + "/obtenerCoordenadas/" + filtro);
  }

  consultarCoordenadaCompleta(latitud: number, longitud: number, departamento: string): Observable<any> {

    return this.http.get(baseUrlCoordenadaConsulta + '/consultaComplejaCoordenada?latitud=' + latitud + '&longitud=' + longitud + '&departamento=' + departamento);

  }

}
