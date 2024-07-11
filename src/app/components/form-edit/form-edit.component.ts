import {Component, forwardRef, Input, OnInit, ViewChild} from "@angular/core";
import {JsonPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {LookupComponent} from "../lookup/lookup.component";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {MetaData} from "../../dto/meta.data";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent,} from "ng-zorro-antd/form";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {TableComponent} from "../table/table.component";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";

@Component({
  selector: 'form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css'],
  standalone: true,
  imports: [NzModalComponent, NzModalContentDirective, JsonPipe, LookupComponent, NgForOf, NgIf, NzInputDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent, NzColDirective, NzFormDirective, FormsModule, ReactiveFormsModule, NzInputGroupComponent, NzSelectComponent, NzOptionComponent, NzRowDirective, NzCheckboxComponent, NzButtonComponent, NzTabSetComponent, NzTabComponent, forwardRef(() => TableComponent), NgSwitchCase, NgSwitchDefault, NzDatePickerComponent, NgSwitch]
})
export class FormEditComponent implements OnInit {

  @Input() metaData!: MetaData;
  @Input() data: any;

  isVisible: boolean = false;
  @ViewChild("form") form!: FormGroup;

  @Input() table!: TableComponent;

  formGroup!: FormGroup;
  private formBuilder: FormBuilder;

  constructor(private fb: FormBuilder) {
    this.formBuilder = fb;
  }

  ngOnInit(): void {

  }

  showDialog(row: any) {
    const controls: any = [];
    this.metaData.fields.forEach((field) => {
      //controls[field.name] = [row[field.name], [Validators.required]];
      controls[field.name] = [row[field.name], []]; //TODO Validators from metaData.fields
    })
    this.formGroup = this.formBuilder.group(controls);
    this.data = row;
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    if (this.formGroup.valid) {
      this.metaData.fields.forEach((field) => {
        this.data[field.name] = this.formGroup.controls[field.name].value;
      });
      this.table.save(this.data);
      this.isVisible = false;

    } else {
      Object.values(this.formGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

}
