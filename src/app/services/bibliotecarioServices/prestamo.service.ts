import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Injectable } from "@angular/core";
import {Prestamo} from '../../interfaces/bibliotecario/prestamo';
import { RegistrarPrestamo } from "../../interfaces/bibliotecario/registrar_prestamo";
import {ActualizarPrestamo} from '../../interfaces/bibliotecario/actualizar_prestamo';

@Injectable({
  providedIn: 'root'
})

export class PrestamoService {

  private myAppUrl: string = environment.endpoint;
  private myApiUrl: string = 'biblioteca/prestamo/all';

  constructor(private http: HttpClient) { }

  obtenerPrestamos(): Observable<Prestamo[]> {
    return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
      map(response => response.$values || response || [])
    );
  }

  registrarPrestamo(data: RegistrarPrestamo): Observable<any> {
  const url = `${this.myAppUrl}biblioteca/prestamo/registrar`;
  return this.http.post<any>(url, data);
}

  actualizarPrestamo(id: number, data: ActualizarPrestamo): Observable<Prestamo> {
    const url = `${this.myAppUrl}biblioteca/prestamo/actualizar/${id}`;
    return this.http.put<Prestamo>(url, data);
  }

  eliminarPrestamo(id: number): Observable<boolean> {
    const url = `${this.myAppUrl}biblioteca/prestamo/eliminar/${id}`;
    return this.http.delete<boolean>(url);
  }

}
