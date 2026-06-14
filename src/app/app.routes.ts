import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login-component";
import {FormDesignerComponent} from "./components/form-designer/form-designer.component";
import {AuthGuard} from "./auth/auth.guard";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'form-designer', component: FormDesignerComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule]
})
export class AppRouteModule {
}
