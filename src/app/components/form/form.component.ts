import {Component, forwardRef, Input, OnInit, ViewChild} from "@angular/core";
import {JsonPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {LookupComponent} from "../lookup/lookup-component";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {MetaData} from "../../dto/meta.data";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent,} from "ng-zorro-antd/form";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {TableComponent} from "../table/table-component";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {FieldTypeName} from "../../dto/field.type.name";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {ReportComponent} from "../report/report-component";
import {DateComponent} from "../date/date-component";

@Component({
    selector: 'form-component',
    templateUrl: './form-component.html',
    styleUrls: ['./form-component.css'],
    imports: [NzModalComponent, NzModalContentDirective, LookupComponent, NgForOf, NgIf, NzInputDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent, NzColDirective, NzFormDirective, FormsModule, ReactiveFormsModule, NzSelectComponent, NzOptionComponent, NzRowDirective, NzButtonComponent, NzTabSetComponent, NzTabComponent, forwardRef(() => TableComponent), NgSwitchCase, NgSwitchDefault, NgSwitch, NzIconDirective, ReportComponent, DateComponent]
})
export class FormComponent implements OnInit {

  @Input() metaData!: MetaData;
  @Input() data: any;
  selectedPrintUrl!: string;

  isVisible: boolean = false;
  @ViewChild("form") form!: FormGroup;
  @ViewChild("rep") reportComponent!: ReportComponent;

  @Input() table!: TableComponent;

  formGroup!: FormGroup;
  private formBuilder: FormBuilder;

  protected readonly FieldTypeName = FieldTypeName;

  constructor(private fb: FormBuilder) {
    this.formBuilder = fb;
  }

  ngOnInit(): void {

  }

  showDialog(row: any) {
    this.table.mapOfBeforeEditValues.set(row[this.metaData.key], structuredClone(row));
    if (this.metaData.reports) {
      if (this.metaData.reports.length > 0)
      this.selectedPrintUrl = this.metaData.reports[0].url;
    }
    const controls: any = [];
    this.metaData.fields.forEach((field) => {
      const fieldValidations = [];
      if (field?.validation?.required === true) {
        fieldValidations.push(Validators.required);
      }
      controls[field.name] = [row[field.name], fieldValidations];
    })
    this.formGroup = this.formBuilder.group(controls);
    this.data = row;
    this.isVisible = true;
  }

  handleCancel() {
    this.table.undo(this.data);
    this.isVisible = false;
  }

  setKeyValue(keyValue: number) {
    this.formGroup.patchValue({
      id : keyValue
    })
  }

  addTableRow(row : any) {
    const rsData = this.table.recordSet;
    if (this.table.recordSet.length == 0) {
      this.table.recordSet = [row];
    } else {
      if (rsData.filter((item) => item.id === row.id).length == 0) {
        rsData.unshift(row);
      }
      this.table.recordSet = rsData;
    }
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

  report(keyValue: any, url: string) {
    this.reportComponent.showDialog(keyValue, url);
  }
}
