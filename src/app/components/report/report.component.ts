import {Component, OnInit} from "@angular/core";
import {JsonPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent,} from "ng-zorro-antd/form";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {SafePipe} from "../../helper/safe.pipe";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  standalone: true,
  imports: [NzModalComponent, NzModalContentDirective, JsonPipe, NgForOf, NgIf, NzInputDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent, NzColDirective, NzFormDirective, FormsModule, ReactiveFormsModule, NzInputGroupComponent, NzSelectComponent, NzOptionComponent, NzRowDirective, NzCheckboxComponent, NzButtonComponent, NzTabSetComponent, NzTabComponent, NgSwitchCase, NgSwitchDefault, NzDatePickerComponent, NgSwitch, NzButtonGroupComponent, NzIconDirective, NzDividerComponent, SafePipe]
})
export class ReportComponent implements OnInit {

  isVisible: boolean = false;
  data: any
  url!: string

  ngOnInit(): void {

  }

  showDialog(data: any, url: string) {
    this.url = environment.API_URL + url + '/' + data
    this.data = data;
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.isVisible = false;
  }

}
