import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Libro} from '../../../interfaces/inventario/libro';
import {InventarioService} from '../../../services/inventarioServices/inventario.service';
import Swal from 'sweetalert2';
import {ActualizarLibro} from '../../../interfaces/inventario/actualizar_libro';

@Component({
  selector: 'app-actualizar-libro',
  templateUrl: './actualizar-libro.component.html',
  styleUrls: ['./actualizar-libro.component.css'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatButtonModule]
})

export class ActualizarLibroComponent {

  titulo: string = '';
  autor: string = '';
  categoria: string = '';
  isbn: string = '';
  estado: string = '';

  constructor(private dialogRef: MatDialogRef<ActualizarLibroComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Libro,
              private inventarioService: InventarioService

  ) {
    if (this.data) {
      this.titulo = this.data.titulo;
      this.autor = this.data.autor;
      this.categoria = this.data.categoria;
      this.isbn = this.data.isbn;
      this.estado = this.data.estado;
    }
  }

  actualizarLibro(): void {
    // Validaciones básicas
    if (!this.titulo.trim() || !this.autor.trim() || !this.categoria.trim() || !this.isbn.trim() || !this.estado) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Todos los campos son obligatorios',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const datosActualizar: ActualizarLibro = {
      titulo: this.titulo.trim(),
      autor: this.autor.trim(),
      categoria: this.categoria.trim(),
      isbn: this.isbn.trim(),
      estado: this.estado,
    };

    this.inventarioService.actualizarLibro(this.data.idLibro, datosActualizar).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'El usuario ha sido actualizado exitosamente',
          confirmButtonColor: '#3085d6'
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al actualizar libro:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el libro',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }
}
