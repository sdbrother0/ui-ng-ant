import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from "../dto/app.config";
import {Menu} from "../dto/menu";
import {BaseComponent} from "../components/content/base-component";
import {AuthGuard} from "../auth/auth.guard";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

  public API_URL = '';
  public menuList: Menu[] = [];

  constructor(private httpClient: HttpClient, private router: Router, private message: NzMessageService) {
  }

  init() {
    this.httpClient.get<AppConfig>('./assets/config.json')
      .subscribe((config) => {
        this.API_URL = config.API_URL;
        this.loadMenu(this.API_URL)
      });
  }
  loadMenu(apiUrl: string){
    if (typeof window !== 'undefined') {
      this.httpClient.get<Menu[]>(apiUrl + '/meta/menu')
        .subscribe({
          next: (menuList) => {
            this.menuList = menuList;
            menuList.forEach((menu) => {
              menu.routes.forEach((route) => {
                this.router.config.push({
                  path: route.path, component: BaseComponent, canActivate: [AuthGuard], data: {metaUrl: route.metaUrl}
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
}
