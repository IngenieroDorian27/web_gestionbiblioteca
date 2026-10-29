import { Component } from "@angular/core";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Libro } from "../../interfaces/inventario/libro";
import { InventarioService } from "../../services/inventarioServices/inventario.service";
import { RegistrarLibroComponent } from "./registrar-libro/registrar-libro.component";
import { ActualizarLibroComponent } from './actualizar-libro/actualizar-libro.component';

@Component({
  selector: 'btnnuevo',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  standalone: true,
  imports: [MatButtonModule,
    MatDividerModule, MatIconModule, MatTableModule, RouterModule,
    MatInput, MatLabel, MatFormFieldModule, FormsModule, MatTooltipModule],
})

export class InventarioComponent {
  columnas: string[] = ['idLibro', 'titulo', 'autor', 'categoria',
    'isbn', 'estado', 'ACCIONES'];
  nombreBuscado: string = '';
  datos: Libro[] = [];

  constructor(private inventarioservice: InventarioService, private dialog: MatDialog,
    private router: Router) { }


  ngOnInit(): void {
    this.obtenerLibros();
  }

  obtenerLibros(): void {
    this.inventarioservice.obtenerLibros().subscribe({
      next: (libros) => {
        this.datos = libros;
        console.log('Libros cargados:', libros);
      },
      error: (error) => {
        alert('Error al obtener libros');
        console.error(error);
      },
      complete: () => {
        console.info('Carga de libros completa');
      }
    });
  }

  buscarLibro(): void {
    if (!this.nombreBuscado.trim()) {
      this.obtenerLibros();
      return;
    }

    this.inventarioservice.getLibroPorNombre(this.nombreBuscado).subscribe({
      next: (libro) => {
        this.datos = [libro];
        console.log('Libro encontrado:', libro);
      },
      error: (error) => {
        this.datos = [];
        Swal.fire({
          icon: 'error',
          title: 'Libro no encontrado',
          text: `No se encontró ningún libro con el nombre "${this.nombreBuscado}".`,
          confirmButtonColor: '#3085d6'
        });
        console.error(error);
      }
    });
  }

  abrirFormularioRegistro(): void {
    const dialogRef = this.dialog.open(RegistrarLibroComponent, {
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((registroExitoso) => {
      if (registroExitoso) {
        this.obtenerLibros();
      }
    });
  }

  abrirFormularioActualizar(libro: Libro): void {
    const dialogRef = this.dialog.open(ActualizarLibroComponent, {
      disableClose: false,
      data: libro
    });
    dialogRef.afterClosed().subscribe((ActualizacionExitosa) => {
      if (ActualizacionExitosa) {
        this.obtenerLibros();
      }
    });
  }

  eliminarLibro(id: number): void {
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
        this.inventarioservice.eliminarLibro(id).subscribe({
          next: (respuesta) => {
            if (respuesta) {
              Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El usuario fue eliminado correctamente.',
                confirmButtonColor: '#3085d6'
              });
              this.obtenerLibros(); // Recarga la tabla
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
}
