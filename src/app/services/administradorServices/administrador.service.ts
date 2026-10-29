import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Usuario } from "../../interfaces/administrador/usuario";
import { Injectable } from "@angular/core";
import { RegistrarUsuario } from "../../interfaces/administrador/registrar_usuario";
import { ActualizarUsuario } from "../../interfaces/administrador/actualizar_usuario";

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private myAppUrl: string = environment.endpoint;
  private myApiUrl: string = 'biblioteca/usuario/allusers';

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
      map(response => response.$values || response || [])
    );
  }

  getUsuarioPorNombre(nombre: string): Observable<Usuario> {
    const url = `${this.myAppUrl}biblioteca/usuario/nombre/${nombre}`;
    return this.http.get<Usuario>(url);
  }

  registrarUsuario(data: RegistrarUsuario): Observable<Usuario> {
    const url = `${this.myAppUrl}biblioteca/usuario/registrar`;
    return this.http.post<Usuario>(url, data);
  }

  actualizarUsuario(id: number, data: ActualizarUsuario): Observable<Usuario> {
    const url = `${this.myAppUrl}biblioteca/usuario/actualizar/${id}`;
    return this.http.put<Usuario>(url, data);
  }

  eliminarUsuario(id: number): Observable<boolean> {
    const url = `${this.myAppUrl}biblioteca/usuario/eliminar/${id}`;
    return this.http.delete<boolean>(url);
  }
}

