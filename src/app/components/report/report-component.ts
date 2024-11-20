import {Component, OnInit} from "@angular/core";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {SafePipe} from "../../helper/safe.pipe";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'report-component',
    templateUrl: './report-component.html',
    styleUrls: ['./report-component.css'],
    imports: [NzModalComponent, NzModalContentDirective, FormsModule, ReactiveFormsModule, NzButtonComponent, SafePipe]
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
