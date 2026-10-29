import { ChangeDetectionStrategy, Component, Inject } from "@angular/core"
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import Swal from "sweetalert2";
import { LibrosDisponiblesDto } from "../../../interfaces/bibliotecario/libros_disponibles";
import { InventarioService } from "../../../services/inventarioServices/inventario.service";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { PrestamoService } from "../../../services/bibliotecarioServices/prestamo.service";
import { RegistrarPrestamo } from "../../../interfaces/bibliotecario/registrar_prestamo";
import { Prestamo } from "../../../interfaces/bibliotecario/prestamo";
import { ActualizarEstadoLibro } from "../../../interfaces/inventario/actualizar_estado";

@Component({
  selector: 'app-registrar-prestamo',
  templateUrl: './registrar-prestamo.component.html',
  styleUrls: ['./registrar-prestamo.component.css'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatButtonModule,
    MatDatepickerModule, CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})


export class RegistrarPrestamoComponent {
  librosDisponibles: LibrosDisponiblesDto[] = [];
  libroSeleccionado: number = 0;
  nombre: string = '';
  cedula: string = '';
  fechaSalida: Date | null = null;
  fechaEntrada: Date | null = null;
  identificadorLibro: number = 0;
  estadoLibro: string = "";

  constructor(private inventarioService: InventarioService, private router: Router,
    private dialogRef: MatDialogRef<RegistrarPrestamoComponent>,
    private prestamoService: PrestamoService,
  ) { }

  ngOnInit(): void {
    this.cargarLibrosDisponibles();
  }

  cargarLibrosDisponibles(): void {
    this.inventarioService.getLibrosDisponibles().subscribe({
      next: (libros) => {
        this.librosDisponibles = libros;
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
      }
    });
  }



  registrarPrestamo(): void {
    // Validaciones básicas
    if (!this.nombre.trim() || !this.cedula.trim() || !this.libroSeleccionado || !this.fechaSalida || !this.fechaEntrada) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Todos los campos son obligatorios',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Validar fechas
    if (this.fechaEntrada <= this.fechaSalida) {
      Swal.fire({
        icon: 'error',
        title: 'Error en fechas',
        text: 'La fecha de entrada debe ser posterior a la fecha de salida',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Obtener título del libro seleccionado
    const libroSeleccionadoObj = this.librosDisponibles.find(libro => libro.idLibro === this.libroSeleccionado);

    const prestamo: RegistrarPrestamo = {
      nombre: this.nombre.trim(),
      cedula: this.cedula.trim(),
      idLibro: this.libroSeleccionado,
      libro: libroSeleccionadoObj?.titulo || '',
      fechaSalida: this.formatearFecha(this.fechaSalida),
      fechaEntrada: this.formatearFecha(this.fechaEntrada)
    };

    // 1. Registrar el préstamo
    this.prestamoService.registrarPrestamo(prestamo).subscribe({
      next: (response) => {
        // 2. Actualizar estado del libro a "Prestado"
        this.inventarioService.actualizarEstadoLibro(this.libroSeleccionado, "Prestado").subscribe({
          next: (estadoResponse: ActualizarEstadoLibro) => {
            Swal.fire({
              icon: 'success',
              title: 'Préstamo registrado',
              text: `El préstamo ha sido registrado exitosamente. ${estadoResponse.message}`,
              confirmButtonColor: '#3085d6'
            });
            this.dialogRef.close(true);
          },
          error: (errorEstado) => {
            console.error('Error al actualizar estado del libro:', errorEstado);
            Swal.fire({
              icon: 'warning',
              title: 'Préstamo registrado',
              text: 'El préstamo se registró correctamente, pero hubo un problema al actualizar el estado del libro',
              confirmButtonColor: '#3085d6'
            });
            this.dialogRef.close(true);
          }
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al registrar el préstamo',
          confirmButtonColor: '#3085d6'
        });
        console.error('Error al registrar préstamo:', error);
      }
    });
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0]; // Formato: "2025-09-22"
  }

  cerrarDialog(): void {
    this.dialogRef.close(false);
  }

}


