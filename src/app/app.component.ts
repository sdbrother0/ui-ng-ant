import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {BaseComponent} from "./components/content/base-component";
import {AuthService} from "./auth/auth.service";
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./components/login/login-component";
import {ReactiveFormsModule} from "@angular/forms";
import {Menu} from "./dto/menu";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterLink, LoginComponent, ReactiveFormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    isCollapsed = false;
    menuList: Menu[] = [];
    authService: AuthService;

    constructor(authService: AuthService, http: HttpClient, private router: Router, private message: NzMessageService) {
        this.authService = authService;
        if (typeof window !== 'undefined') {
            http.get<Menu[]>(environment.API_URL + '/meta/menu')
                .subscribe({
                    next: (menuList) => {
                        this.menuList = menuList;
                        menuList.forEach((menu) => {
                            menu.routes.forEach((route) => {
                                router.config.push({
                                    path: route.path,
                                    component: BaseComponent,
                                    canActivate: [AuthGuard],
                                    data: {metaUrl: route.metaUrl}
                                })
                            });
                        });
                    }, error: (error) => {
                        console.error(error);
                        this.message.create('error', `Error: ${error.message}`);
                    }
                });
        }

    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

}
