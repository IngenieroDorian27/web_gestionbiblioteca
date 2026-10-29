import { Component } from "@angular/core"
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { AdministradorService } from "../../../services/administradorServices/administrador.service";
import Swal from "sweetalert2";
import { RegistrarUsuario } from "../../../interfaces/administrador/registrar_usuario";

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatButtonModule]
})

export class RegistrarUsuarioComponent {
  usuario: string = '';
  contrasena: string = '';
  rol: string = '';

  roles: { value: string; viewValue: string }[] = [
    { value: 'bibliotecario', viewValue: 'Bibliotecario' },
    { value: 'administrador', viewValue: 'Administrador' },
    { value: 'inventario', viewValue: 'Inventario' }
  ];

  constructor(private dialogRef: MatDialogRef<RegistrarUsuarioComponent>,
    private administradorService: AdministradorService
  ) { }

  registrarUsuario(): void {
    if (!this.usuario || !this.contrasena || !this.rol) {
      Swal.fire('Campos incompletos', 'Por favor llena todos los campos', 'warning');
      return;
    }

    const nuevoUsuario: RegistrarUsuario = {
      usuario: this.usuario,
      pasword: this.contrasena,
      rol: this.rol
    };

    this.administradorService.registrarUsuario(nuevoUsuario).subscribe({
      next: (response) => {
        Swal.fire('Usuario registrado', `ID asignado: ${response.idUser}`, 'success');
        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire('Error al registrar', 'Intenta nuevamente', 'error');
      }
    });

    this.dialogRef.close(false);
  }
}
