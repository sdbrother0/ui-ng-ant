import {Component, Input, OnInit} from "@angular/core";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {MetaData} from "../../dto/meta.data";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css'],
  standalone: true,
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    JsonPipe
  ]
})
export class FormEditComponent {

  @Input() metaData: MetaData | undefined;
  @Input() data: any | undefined;

  isVisible: boolean = false;

  showDialog() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.isVisible = false;
  }

}
