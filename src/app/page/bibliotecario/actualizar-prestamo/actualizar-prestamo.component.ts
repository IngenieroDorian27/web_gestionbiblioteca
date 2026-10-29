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
import { CommonModule } from "@angular/common";
import { LibrosDisponiblesDto } from "../../../interfaces/bibliotecario/libros_disponibles";
import { InventarioService } from "../../../services/inventarioServices/inventario.service";
import { PrestamoService } from '../../../services/bibliotecarioServices/prestamo.service';
import { Prestamo } from '../../../interfaces/bibliotecario/prestamo';
import { ActualizarPrestamo } from '../../../interfaces/bibliotecario/actualizar_prestamo';
import Swal from "sweetalert2";

@Component({
  selector: 'app-registrar-prestamo',
  templateUrl: './actualizar-prestamo.component.html',
  styleUrls: ['./actualizar-prestamo.component.css'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatButtonModule,
    MatDatepickerModule, CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})


export class ActualizarPrestamoComponent {

  librosDisponibles: LibrosDisponiblesDto[] = [];
  libroSeleccionado: number = 0;
  nombre: string = '';
  cedula: string = '';
  fechaSalida: Date | null = null;
  fechaEntrada: Date | null = null;

  constructor(private inventarioService: InventarioService, private prestamoService: PrestamoService,
    private dialogRef: MatDialogRef<ActualizarPrestamoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Prestamo) {
    if (this.data) {
      this.nombre = this.data.nombre;
      this.cedula = this.data.cedula;
      this.fechaSalida = new Date(this.data.fechaSalida);
      this.fechaEntrada = new Date(this.data.fechaEntrada);
    }
  }

  ngOnInit(): void {
    this.cargarLibrosDisponibles();
  }

  cargarLibrosDisponibles(): void {
    this.inventarioService.getLibrosDisponibles().subscribe({
      next: (libros) => {
        this.librosDisponibles = libros;
        const libroEncontrado = libros.find(l => l.titulo === this.data.libro);
        if (libroEncontrado) {
          this.libroSeleccionado = libroEncontrado.idLibro;
        }
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
      }
    });
  }


  // Método para actualizar préstamo

  actualizarPrestamo(): void {
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

    const prestamoActualizado: ActualizarPrestamo = {
      nombre: this.nombre.trim(),
      cedula: this.cedula.trim(),
      idLibro: this.libroSeleccionado,
      libro: libroSeleccionadoObj?.titulo || '',
      fechaSalida: this.formatearFecha(this.fechaSalida),
      fechaEntrada: this.formatearFecha(this.fechaEntrada)
    };

    this.prestamoService.actualizarPrestamo(this.data.idPrestamo, prestamoActualizado).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Préstamo actualizado',
          text: 'El préstamo ha sido actualizado exitosamente',
          confirmButtonColor: '#3085d6'
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el préstamo',
          confirmButtonColor: '#3085d6'
        });
        console.error('Error al actualizar préstamo:', error);
      }
    });
  }

  // Método para cerrar el dialog
  cerrarDialog(): void {
    this.dialogRef.close(false);
  }

  private formatearFecha(fecha: Date | string): string {
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    return d.toISOString().split('T')[0]; // "2025-09-22"
  }

}
