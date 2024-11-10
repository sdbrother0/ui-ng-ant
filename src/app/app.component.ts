import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {HttpClient} from "@angular/common/http";
import {Route} from "./dto/route";
import {environment} from "../environments/environment";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {BaseComponent} from "./content/base.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isCollapsed = false;
  routers: Route[] = [];

  constructor(http: HttpClient, router: Router) {
    http.get<Route[]>(environment.API_URL + '/meta/routes')
      .subscribe({
        next: (route) => {
          route.forEach(r =>
            router.config.push({
              path: r.path,
              component: BaseComponent,
              data: {metaUrl: r.metaUrl}
            })
          );
          this.routers = route;
        },
        error: (error) => {
          console.error(error)
        }
      });
  }
}
