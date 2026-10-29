import { Component, Inject } from "@angular/core"
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import Swal from "sweetalert2";
import { Usuario } from "../../../interfaces/administrador/usuario";
import { AdministradorService } from "../../../services/administradorServices/administrador.service";
import { ActualizarUsuario } from "../../../interfaces/administrador/actualizar_usuario";

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.css'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatButtonModule]
})

export class ActualizarUsuarioComponent {
  usuario: string = '';
  contrasena: string = '';
  rol: string = '';

  roles: { value: string; viewValue: string }[] = [
    { value: 'bibliotecario', viewValue: 'Bibliotecario' },
    { value: 'administrador', viewValue: 'Administrador' },
    { value: 'inventario', viewValue: 'Inventario' }
  ];

  constructor(private dialogRef: MatDialogRef<ActualizarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private administradorService: AdministradorService

  ) {
    if (this.data) {
      this.usuario = this.data.usuario;
      this.contrasena = this.data.pasword;
      this.rol = this.data.rol;
    }
  }

  actualizarUsuario(): void {
    // Validaciones básicas
    if (!this.usuario.trim() || !this.contrasena.trim() || !this.rol) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Todos los campos son obligatorios',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const datosActualizar: ActualizarUsuario = {
      usuario: this.usuario.trim(),
      pasword: this.contrasena.trim(),
      rol: this.rol
    };

    this.administradorService.actualizarUsuario(this.data.idUser, datosActualizar).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'El usuario ha sido actualizado exitosamente',
          confirmButtonColor: '#3085d6'
        });
        this.dialogRef.close(true); // Cerrar dialog y indicar éxito
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el usuario',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  cerrarDialog(): void {
    this.dialogRef.close(false);
  }
}

