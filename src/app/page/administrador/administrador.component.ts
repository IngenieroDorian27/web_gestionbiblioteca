import { Component } from "@angular/core";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Usuario } from "../../interfaces/administrador/usuario";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegistrarUsuarioComponent } from "./registrar-usuario/registrar-usuario.component";
import { AdministradorService } from "../../services/administradorServices/administrador.service";
import { ActualizarUsuarioComponent } from "./actualizar-usuario/actualizar-usuario.component";


@Component({
  selector: 'btnnuevo',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css'],
  standalone: true,
  imports: [MatButtonModule,
    MatDividerModule, MatIconModule, MatTableModule, RouterModule,
    MatInput, MatLabel, MatFormFieldModule, FormsModule, MatTooltipModule],
})

export class AdministradorComponent {
  columnas: string[] = ['idUser', 'usuario', 'pasword', 'rol', 'ACCIONES'];
  datos: Usuario[] = [];
  nombreBuscado: string = '';

  constructor(private administradorservice: AdministradorService, private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.administradorservice.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.datos = usuarios;
        console.log('Usuarios cargados:', usuarios);
      },
      error: (error) => {
        alert('Error al obtener usuarios');
        console.error(error);
      },
      complete: () => {
        console.info('Carga de usuarios completa');
      }
    });
  }

  buscarUsuario(): void {
    if (!this.nombreBuscado.trim()) {
      this.obtenerUsuarios();
      return;
    }

    this.administradorservice.getUsuarioPorNombre(this.nombreBuscado).subscribe({
      next: (usuario) => {
        this.datos = [usuario]; // Mostrar solo el usuario encontrado
        console.log('Usuario encontrado:', usuario);
      },
      error: (error) => {
        this.datos = [];
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: `No se encontró ningún usuario con el nombre "${this.nombreBuscado}".`,
          confirmButtonColor: '#3085d6'
        });
        console.error(error);
      }
    });
  }

  abrirFormularioRegistro(): void {
    const dialogRef = this.dialog.open(RegistrarUsuarioComponent, {
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((registroExitoso) => {
      if (registroExitoso) {
        this.obtenerUsuarios();
      }
    });
  }

  abrirFormularioActualizar(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ActualizarUsuarioComponent, {
      disableClose: false,
      data: usuario
    });
    dialogRef.afterClosed().subscribe((ActualizacionExitosa) => {
      if (ActualizacionExitosa) {
        this.obtenerUsuarios();
      }
    });
  }

  cerrarSesion(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión actual se cerrará.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['']);
      }
    });
  }

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el usuario permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.administradorservice.eliminarUsuario(id).subscribe({
          next: (respuesta) => {
            if (respuesta) {
              Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El usuario fue eliminado correctamente.',
                confirmButtonColor: '#3085d6'
              });
              this.obtenerUsuarios(); // Recarga la tabla
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el usuario.',
                confirmButtonColor: '#3085d6'
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error de servidor',
              text: 'Ocurrió un problema al intentar eliminar el usuario.',
              confirmButtonColor: '#3085d6'
            });
            console.error(error);
          }
        });
      }
    });
  }


}

