import {Component, forwardRef, Injectable, Injector, Input, OnInit, ViewChild} from "@angular/core";
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {JsonPipe, NgForOf} from "@angular/common";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule, NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator, Validators
} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzModalModule} from 'ng-zorro-antd/modal';
import {TableComponent} from "../table/table.component";
import {Field} from "../../dto/field";

@Component({
  host: {ngSkipHydration: 'true'},
  selector: 'lookup-data',
  standalone: true,
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css'],
  imports: [
    NzTableModule,
    NzTableComponent,
    JsonPipe,
    NgForOf,
    NzInputDirective,
    FormsModule,
    NzButtonComponent,
    NzInputGroupComponent,
    NzIconDirective,
    NzTooltipDirective,
    NzModalModule,
    forwardRef(() => TableComponent)
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LookupComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: LookupComponent
    },
  ]
})
export class LookupComponent implements OnInit, ControlValueAccessor, Validator {

  @Input() row!: any;
  @Input() field!: Field;
  @ViewChild('lookup_table') lookupTable!: TableComponent;
  isDialogVisible = false;

  onChange = () => {};
  onTouched = () => {};

  touched = false;

  disabled = false;

  constructor() {

  }

  //for validate methods start:
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.hasValidator(Validators.required)) {
      if (this.row[this.field.name] == null) {
        console.log('NULL');
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
  //for validate methods end

  ngOnInit(): void {

  }

  openDialog(lookupMetaData: any, lookupData: any) {
    this.isDialogVisible = true;
  }

  handleOk(data: any): void {
    this.isDialogVisible = false;
  }

  handleCancel(): void {
    this.isDialogVisible = false;
  }

  showModal(): void {
    this.isDialogVisible = true;
  }


}
