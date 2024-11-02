import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'product', loadChildren: () => import('./pages/product/product.routes').then(m => m.PRODUCT_ROUTES) },
  { path: 'customer', loadChildren: () => import('./pages/customer/customer.routes').then(m => m.CUSTOMER_ROUTES) },
  { path: 'invoice', loadChildren: () => import('./pages/invoice/invoice.routes').then(m => m.INVOICE_ROUTES) },
];
