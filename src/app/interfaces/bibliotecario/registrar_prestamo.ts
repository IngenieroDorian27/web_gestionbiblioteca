export interface RegistrarPrestamo {
  nombre: string;
  cedula: string;
  idLibro: number;
  libro: string;  // Título del libro para mostrar
  fechaSalida: string;  // Formato ISO: "2025-09-22"
  fechaEntrada: string;
}
