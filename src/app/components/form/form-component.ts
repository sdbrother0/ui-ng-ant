import {Component, OnInit} from "@angular/core";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {SafePipe} from "../../helper/safe.pipe";
import {AppLoaderService} from "../../service/app.loader.service";

@Component({
    selector: 'form-component',
    templateUrl: './form-component.html',
    styleUrls: ['./form-component.css'],
    imports: [FormsModule, ReactiveFormsModule]
})
export class FormComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

  }

}
