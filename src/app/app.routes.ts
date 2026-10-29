import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AdministradorComponent } from './page/administrador/administrador.component';
import { PrestamoComponent } from './page/bibliotecario/prestamo.component';
import { InventarioComponent } from './page/inventario/inventario.component';

export const routes: Routes = [

  {
    path: '',
    component: LoginComponent,
  },

  {
    path: 'administrador',
    component: AdministradorComponent,
  },

  {
    path: 'bibliotecario',
    component: PrestamoComponent,
  },

  {
    path: 'inventario',
    component: InventarioComponent,
  },

];
