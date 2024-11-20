import {Component, Input, OnInit} from "@angular/core";
import {NzInputGroupComponent} from "ng-zorro-antd/input";
import {Field} from "../../dto/field";
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from "@angular/forms";
import {FormComponent} from "../form/form.component";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {DatePipe} from "@angular/common";


@Component({
    host: { ngSkipHydration: 'true' },
    selector: 'date-component',
    templateUrl: './date-component.html',
    styleUrls: ['./date-component.css'],
    imports: [
        NzDatePickerComponent,
        FormsModule,
        NzInputGroupComponent
    ],
    providers: [{
            provide: NG_VALUE_ACCESSOR, multi: true, useExisting: DateComponent
        }, {
            provide: NG_VALIDATORS, multi: true, useExisting: DateComponent
        },]
})
export class DateComponent implements OnInit, ControlValueAccessor, Validator {

  @Input() row!: any;
  @Input() field!: Field;
  @Input() parentForm!: FormComponent;
  @Input() format!: string;

  date!: Date;

  onChange = () => {

  };
  onTouched = () => {

  };

  touched = false;

  disabled = false;

  constructor(public datepipe: DatePipe) {
  }

  ngOnInit(): void {
    if (Object.keys(this.row).length) {
      this.date = new Date(this.row[this.field.name]);
    }
  }

  onDateChange($event: any) {
    const strValue = this.datepipe.transform($event, this.format);
    this.row[this.field.name] = strValue;
    this.parentForm.formGroup.controls[this.field.name].setValue(strValue);
  }

  //for validate methods start:
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.hasValidator(Validators.required)) {
      if (this.row[this.field.name] == null) {
        return {
          error: {}
        };
      }
    }
    return null;
  }

  writeValue(obj: Date): void {
    this.row[this.field.name] = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
