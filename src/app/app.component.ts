import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "./auth/auth.service";
import {LoginComponent} from "./components/login/login-component";
import {ReactiveFormsModule} from "@angular/forms";
import {AppLoaderService} from "./service/app.loader.service";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterLink, LoginComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isCollapsed = false;
  appLoaderService: AppLoaderService;
  authService: AuthService;

  constructor(authService: AuthService, private router: Router, appLoaderService: AppLoaderService) {
    this.authService = authService;
    this.appLoaderService = appLoaderService;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
