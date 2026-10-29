import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UsuarioLoginResponse } from '../../interfaces/login/UsuarioLoginResponse';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private myAppUrl: string = environment.endpoint;
  private myApiUrl: string = 'biblioteca/usuario/allusers';

  constructor(private http: HttpClient) { }

  login(usuario: string, contrasena: string): Observable<UsuarioLoginResponse> {
    const url = `${this.myAppUrl}biblioteca/usuario/login`;
    return this.http.post<UsuarioLoginResponse>(url, { usuario: usuario, pasword: contrasena });
  }


}
