import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {AuthService} from "../../auth/auth.service";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Auth} from "../../dto/auth";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzSpaceComponent} from "ng-zorro-antd/space";
import {AppLoaderService} from "../../service/app.loader.service";

@Component({
    selector: 'login-component',
    imports: [CommonModule, NzIconModule, NzLayoutModule, NzMenuModule, NzButtonComponent, NzFormItemComponent, NzFormControlComponent, NzInputGroupComponent, NzRowDirective, NzColDirective, ReactiveFormsModule, NzInputDirective, NzFormDirective, FormsModule, NzCardComponent, NzSpaceComponent],
    templateUrl: './login-component.html',
    styleUrls: ['./login-component.css']
})

export class LoginComponent {
  public signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private appLoaderService: AppLoaderService, private authService: AuthService, private router: Router, private http: HttpClient, private message: NzMessageService) {
  }

  login() {
    if (this.signupForm.valid) {
      this.http.post<Auth>(this.appLoaderService.API_URL + '/login', this.signupForm.value)
        .subscribe({
          next: (auth: Auth) => {
            this.authService.login(auth.token);
            this.router.navigate(['/']);
          }, error: (error) => {
            console.error(error);
            this.message.create('error', `Error: ${error.message}`);
          }, complete: () => {
          }
        });
    }
  }
}
