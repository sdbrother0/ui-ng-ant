import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login-component";

export const routes: Routes = [{path: 'login', component: LoginComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule]
})
export class AppRouteModule {
}
