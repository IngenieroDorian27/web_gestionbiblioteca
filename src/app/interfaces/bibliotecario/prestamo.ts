export interface Prestamo{

  idPrestamo: number;
  idLibro: number;
  nombre: string;
  cedula: string;
  libro: string;
  fechaSalida: Date;
  fechaEntrada: Date;
  idLibroNavigation: any;

}
