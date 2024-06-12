import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Coordenada } from '../models/coordenada.model';
import { Observable } from 'rxjs';

const baseUrl = AppSettings.API_ENDPOINT + '/coordenadas';


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

}
