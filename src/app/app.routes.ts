import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/menu1' },
  { path: 'menu1', loadChildren: () => import('./pages/menu1/menu1.routes').then(m => m.MENU1_ROUTES) },
  { path: 'menu2', loadChildren: () => import('./pages/menu2/menu2.routes').then(m => m.MENU2_ROUTES) },
  { path: 'menu3', loadChildren: () => import('./pages/menu3/menu3.routes').then(m => m.MENU3_ROUTES) }
];
