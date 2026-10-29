import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from "../../services/loginServices/login.service";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
})

export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  iniciarSesion(): void {
    this.usuarioService.login(this.usuario, this.contrasena).subscribe({
      next: (usuario) => {
        if (!usuario.rol) {
          Swal.fire('Error de sesión', 'No se recibió el rol del usuario', 'error');
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Accediendo como ${usuario.rol}`,
          timer: 2000,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          willClose: () => {
            switch (usuario.rol) {
              case 'administrador':
                this.router.navigate(['/administrador']);
                break;
              case 'bibliotecario':
                this.router.navigate(['/bibliotecario']);
                break;
              case 'inventario':
                this.router.navigate(['/inventario']);
                break;
              default:
                Swal.fire('Rol no reconocido', '', 'error');
            }
          }
        });
      },
      error: () => {
        Swal.fire('Credenciales incorrectas', 'Verifica usuario y contraseña', 'error');
      }
    });
  }
}
