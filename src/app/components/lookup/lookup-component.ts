import {Component, forwardRef, Input, OnInit, ViewChild} from "@angular/core";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzModalModule} from 'ng-zorro-antd/modal';
import {TableComponent} from "../table/table-component";
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
import {TableFormComponent} from "../table/form/table-form.component";

@Component({
    host: { ngSkipHydration: 'true' },
    selector: 'lookup-component',
    templateUrl: './lookup-component.html',
    styleUrls: ['./lookup-component.css'],
    imports: [NzTableModule, NzInputDirective, FormsModule, NzButtonComponent, NzInputGroupComponent, NzIconDirective, NzTooltipDirective, NzModalModule, forwardRef(() => TableComponent)],
    providers: [{
            provide: NG_VALUE_ACCESSOR, multi: true, useExisting: LookupComponent
        }, {
            provide: NG_VALIDATORS, multi: true, useExisting: LookupComponent
        },]
})
export class LookupComponent implements OnInit, ControlValueAccessor, Validator {

  @Input() row!: any;
  @Input() field!: Field;
  @Input() parentForm!: TableFormComponent;

  @ViewChild('lookup_table') lookupTable!: TableComponent;
  isDialogVisible = false;

  onChange = () => {
  };
  onTouched = () => {
  };

  touched = false;

  disabled = false;

  constructor() {

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

  writeValue(obj: any): void {
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

  ngOnInit(): void {

  }

  openDialog() {
    this.isDialogVisible = true;
  }

  handleOk(data: any): void {
    this.isDialogVisible = false;
  }

  handleCancel(): void {
    this.isDialogVisible = false;
  }


}
