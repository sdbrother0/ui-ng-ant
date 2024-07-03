import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {LookupComponent} from "../lookup/lookup.component";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {MetaData} from "../../dto/meta.data";
import {
  NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent,
} from "ng-zorro-antd/form";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
  FormBuilder,
  FormGroup, FormsModule, ReactiveFormsModule, Validators
} from "@angular/forms";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";

@Component({
  selector: 'form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css'],
  standalone: true,
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    JsonPipe,
    LookupComponent,
    NgForOf,
    NgIf,
    NzInputDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzColDirective,
    NzFormDirective,
    FormsModule,
    ReactiveFormsModule,
    NzInputGroupComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzRowDirective,
    NzCheckboxComponent,
    NzButtonComponent,
    NzTabSetComponent,
    NzTabComponent,
  ]
})
export class FormEditComponent implements OnInit {

  @Input() metaData!: MetaData;
  @Input() data: any;

  isVisible: boolean = false;
  @ViewChild("form") form!: FormGroup;

  formGroup!: FormGroup;
  private formBuilder: FormBuilder;

  constructor(private fb: FormBuilder) {
    this.formBuilder = fb;
  }

  ngOnInit(): void {

  }

  showDialog(row: any) {
    const controls: any = [];
    const validators: any[] = [];
    //validators.push(Validators.email);
    //TODO from server metaData
    controls["id"] = [row["id"], []];
    controls["test"] = [row["test"], [Validators.required]];
    controls["test2"] = [row["test2"]];

    this.formGroup = this.formBuilder.group(controls);
    console.log(this.data);
    this.data = row;

    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    if (this.formGroup.valid) {
      this.isVisible = false;

      this.data["id"] = this.formGroup.controls["id"].value;
      this.data["test"] = this.formGroup.controls["test"].value;
      //this.data["test2"] = this.formGroup.controls["test2"].value; //Валидация для поля!!!

    } else {
      Object.values(this.formGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  submitForm(ctrl: any) {
    console.log('submit from form')
  }
}
