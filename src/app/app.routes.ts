import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/table1' },
  { path: 'table1', loadChildren: () => import('./pages/table1/table1.routes').then(m => m.TABLE1_ROUTES) },
  { path: 'table2', loadChildren: () => import('./pages/table2/table2.routes').then(m => m.TABLE2_ROUTES) },
  { path: 'table3', loadChildren: () => import('./pages/table3/table3.routes').then(m => m.TABLE3_ROUTES) }
];
