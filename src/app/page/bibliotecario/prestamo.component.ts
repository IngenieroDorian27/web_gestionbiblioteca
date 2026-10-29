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
import { Prestamo } from '../../interfaces/bibliotecario/prestamo';
import { PrestamoService } from '../../services/bibliotecarioServices/prestamo.service';
import { RegistrarPrestamoComponent } from "./registrar-prestamo/registrar-prestamo.component";
import { ActualizarPrestamoComponent } from "./actualizar-prestamo/actualizar-prestamo.component";
import { InventarioService } from "../../services/inventarioServices/inventario.service";

@Component({
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.css'],
  standalone: true,
  imports: [MatButtonModule,
    MatDividerModule, MatIconModule, MatTableModule, RouterModule,
    MatInput, MatLabel, MatFormFieldModule, FormsModule, MatTooltipModule],
})

export class PrestamoComponent {

  columnas: string[] = ['idPrestamo', 'nombre', 'cedula', 'libro',
    'fechasalida', 'fechaentrada', 'ACCIONES'];
  nombreBuscado: string = '';
  datos: Prestamo[] = [];

  constructor(private prestamoservice: PrestamoService, private dialog: MatDialog,
    private router: Router, private inventarioservice: InventarioService) { }

  ngOnInit(): void {
    this.obtenerPrestamos();
  }

  obtenerPrestamos(): void {
    this.prestamoservice.obtenerPrestamos().subscribe({
      next: (prestamos) => {
        this.datos = prestamos;
        console.log('Prestamos cargados:', prestamos);
      },
      error: (error) => {
        alert('Error al obtener prestamo');
        console.error(error);
      },
      complete: () => {
        console.info('Carga de Prestamos completa');
      }
    });
  }

  abrirFormularioRegistro(): void {
    const dialogRef = this.dialog.open(RegistrarPrestamoComponent, {
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((registroExitoso) => {
      if (registroExitoso) {
        this.obtenerPrestamos();
      }
    });
  }

  abrirFormularioActualizar(prestamo: Prestamo): void {
    const dialogRef = this.dialog.open(ActualizarPrestamoComponent, {
      disableClose: false,
      data: prestamo
    });
    dialogRef.afterClosed().subscribe((ActualizacionExitosa) => {
      if (ActualizacionExitosa) {
        this.obtenerPrestamos();
      }
    });
  }

  // Método para eliminar préstamo (para usar en el componente principal de la tabla)
  eliminarPrestamo(prestamo: Prestamo): void {
  Swal.fire({
    title: '¿Eliminar préstamo?',
    text: `Se eliminará el préstamo del libro "${prestamo.libro}"`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.prestamoservice.eliminarPrestamo(prestamo.idPrestamo).subscribe({
        next: () => {
          this.inventarioservice.actualizarEstadoLibro(prestamo.idLibro, "Disponible").subscribe({
            next: () => {
              Swal.fire('Préstamo eliminado', 'El libro ha sido liberado correctamente', 'success');
              this.obtenerPrestamos();
            },
            error: () => {
              Swal.fire('Préstamo eliminado', 'Pero no se pudo actualizar el estado del libro', 'warning');
              this.obtenerPrestamos();
            }
          });
        },
        error: () => {
          Swal.fire('Error', 'No se pudo eliminar el préstamo', 'error');
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
