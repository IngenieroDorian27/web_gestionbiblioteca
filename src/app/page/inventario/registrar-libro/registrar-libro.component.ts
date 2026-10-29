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
import { InventarioService } from '../../../services/inventarioServices/inventario.service';
import { RegistrarLibro } from "../../../interfaces/inventario/registrar_libro";

@Component({
  selector: 'app-registrar-libro',
  templateUrl: './registrar-libro.component.html',
  styleUrls: ['./registrar-libro.component.css'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatButtonModule]
})

export class RegistrarLibroComponent {
  titulo: string = '';
  autor: string = '';
  categoria: string = '';
  isbn: string = '';
  estado: string = '';


  constructor(private dialogRef: MatDialogRef<RegistrarLibroComponent>,
    private inventarioservice : InventarioService
  ) { }

  registrarLibro(): void {
    if (!this.titulo || !this.autor || !this.categoria || !this.isbn) {
      Swal.fire('Campos incompletos', 'Por favor llena todos los campos', 'warning');
      return;
    }

    const nuevoLibro: RegistrarLibro = {
      titulo: this.titulo,
      autor: this.autor,
      categoria: this.categoria,
      isbn: this.isbn,
      estado: "Disponible",
    };

    this.inventarioservice.registrarLibro(nuevoLibro).subscribe({
      next: (response) => {
        Swal.fire('Libro registrado', `ID asignado: ${response.idLibro}`, 'success');
        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire('Error al registrar', 'Intenta nuevamente', 'error');
      }
    });

    this.dialogRef.close(false);
  }
}
