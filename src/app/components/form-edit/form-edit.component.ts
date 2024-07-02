import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {LookupComponent} from "../lookup/lookup.component";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {MetaData} from "../../dto/meta.data";
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from "ng-zorro-antd/form";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
  AbstractControlOptions, FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzButtonComponent} from "ng-zorro-antd/button";

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
  ]
})
export class FormEditComponent implements OnInit {

  @Input() metaData!: MetaData;
  @Input() data: any;

  isVisible: boolean = false;
  @ViewChild("form") form!: FormGroup;

  validateForm!: FormGroup;
  private formBuilder: NonNullableFormBuilder;
  // validateForm: FormGroup<{
  //   email: FormControl<string>;
  // }>;

  constructor(private fb: NonNullableFormBuilder) {
    this.formBuilder = fb;
  }

  ngOnInit(): void {
    const controls: any = [];
    controls["email"] = ['', [Validators.email, Validators.required]];
    //add all fields
    //console.log(this.metaData)
    this.validateForm = this.fb.group(controls);
  }

  showDialog() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    if (this.validateForm.valid) {
      this.isVisible = false;
      //console.log('controls');
      //console.log(this.validateForm.controls);
      Object.values(this.validateForm.controls).forEach(control => {
        //console.log(control);
        console.log(control.status);
        console.log(control.value);
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


}
