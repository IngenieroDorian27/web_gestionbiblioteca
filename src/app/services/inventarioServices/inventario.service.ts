import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Injectable } from "@angular/core";
import { Libro } from "../../interfaces/inventario/libro";
import { RegistrarLibro } from "../../interfaces/inventario/registrar_libro";
import { ActualizarLibro } from "../../interfaces/inventario/actualizar_libro";
import { LibrosDisponiblesDto } from "../../interfaces/bibliotecario/libros_disponibles";
import { ActualizarEstadoLibro } from "../../interfaces/inventario/actualizar_estado";

@Injectable({
  providedIn: 'root'
})

export class InventarioService {

  private myAppUrl: string = environment.endpoint;
  private myApiUrl: string = 'biblioteca/libro/todos';

  constructor(private http: HttpClient) { }

  obtenerLibros(): Observable<Libro[]> {
    return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
      map(response => response.$values || response || [])
    );
  }

  getLibroPorNombre(nombre: string): Observable<Libro> {
    const url = `${this.myAppUrl}biblioteca/libro/nombre/${nombre}`;
    return this.http.get<Libro>(url);
  }

  registrarLibro(data: RegistrarLibro): Observable<Libro> {
    const url = `${this.myAppUrl}biblioteca/libro/registrar`;
    return this.http.post<Libro>(url, data);
  }

  actualizarLibro(id: number, data: ActualizarLibro): Observable<Libro> {
    const url = `${this.myAppUrl}biblioteca/libro/update/${id}`;
    return this.http.put<Libro>(url, data);
  }

  eliminarLibro(id: number): Observable<boolean> {
    const url = `${this.myAppUrl}biblioteca/libro/delete/${id}`;
    return this.http.delete<boolean>(url);
  }

  getLibrosDisponibles(): Observable<LibrosDisponiblesDto[]> {
    const url = `${this.myAppUrl}biblioteca/libro/disponibles`;
    return this.http.get<LibrosDisponiblesDto[]>(url);
  }

  actualizarEstadoLibro(id: number, estado: string): Observable<ActualizarEstadoLibro> {
    const url = `${this.myAppUrl}biblioteca/libro/updateestado/${id}`;
    const data = { estado };
    return this.http.put<ActualizarEstadoLibro>(url, data);
  }

}
