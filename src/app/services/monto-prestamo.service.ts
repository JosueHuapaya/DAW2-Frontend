import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MontoPrestamo } from '../models/monto-prestamo.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';


const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/monto';
const baseUrlCrudPrueba = AppSettings.API_ENDPOINT+ '/crudmontoprestamo';

@Injectable({
  providedIn: 'root'
})
export class MontoPrestamoService {

  constructor(private http:HttpClient) { }

  registrar(data:MontoPrestamo):Observable<any>{
    return this.http.post(baseUrlPrueba, data);
  }
//PC2

consultarCrud(filtro:string):Observable<any>{
  return this.http.get(baseUrlCrudPrueba+"/listaCapital/"+ filtro);
}
  registrarCrud(data:MontoPrestamo):Observable<any>{
    return this.http.post(baseUrlCrudPrueba+"/registramontoprestamo", data);
  }
  actualizarMonto(data:MontoPrestamo):Observable<any>{
    console.log('>>> Service >> actualizarMonto [inicio]' + data);
    return this.http.put(baseUrlCrudPrueba+"/actualizarmontoprestamo", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudPrueba+"/eliminarmontoprestamo/"+id);
  }
 
  validaactualizamontoprestamo(capital: number, id:number): Observable<any>{
    console.log('>>> Service >> validaactualizamontoprestamo [inicio]' + capital);
    return this.http.get<any>(baseUrlCrudPrueba+'/validaactualizamontoprestamo?capital='+capital +"&idMontoPrestamo"+id);
  }
}
