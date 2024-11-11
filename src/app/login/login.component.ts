import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {AuthService} from "../auth.service";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzLayoutModule, NzMenuModule, NzButtonComponent, NzFormItemComponent, NzFormControlComponent, NzInputGroupComponent, NzRowDirective, NzColDirective, NzCheckboxComponent, ReactiveFormsModule, NzInputDirective, NzFormDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  validateForm: FormGroup = new FormGroup("");
  constructor(private authService: AuthService, private router: Router) {
  }
  login() {
    this.authService.login();
    this.router.navigate(['/']);
  }
}
