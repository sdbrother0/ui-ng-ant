import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {NzTableComponent, NzTableModule, NzTableQueryParams} from "ng-zorro-antd/table";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DatePipe, JsonPipe, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {MetaData} from "../../dto/meta.data";
import {LookupComponent} from "../lookup/lookup.component";
import {FormEditComponent} from "../form-edit/form-edit.component";
import {v4 as uuidv4} from 'uuid';
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {Field} from "../../dto/field";
import {NzTableSortOrder} from "ng-zorro-antd/table/src/table.types";
import {NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";

@Component({
  host: {ngSkipHydration: 'true'},
  selector: 'table-data',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [NzTableModule, NzTableComponent, JsonPipe, NgForOf, NzInputDirective, FormsModule, NzButtonComponent, NzInputGroupComponent, NzIconDirective, NgIf, NzButtonGroupComponent, NzTooltipDirective, NzModalModule, forwardRef(() => LookupComponent), forwardRef(() => FormEditComponent), NzDatePickerComponent, NgSwitch, NgSwitchCase, NgSwitchDefault, DatePipe, NzDropdownMenuComponent, NgStyle]
})
export class TableComponent implements OnInit {

  @Input() metaUrl: string = 'title';
  @Input() pageIndex: number = 1;
  @Input() pageSize: number = 10;
  @Input() total: number = 0;
  @Input() masterId!: string;
  @Input() masterObjectName!: string;
  @Input() masterFieldKey!: string;
  sort: Array<{ key: string; value: NzTableSortOrder; }> = [];

  @ViewChild("form_edit") formEdit!: FormEditComponent;

  recordSet: any[] = [];
  loading: boolean = true;
  checked = false;
  indeterminate = false;
  private setOfCheckedId = new Set<number>();
  private setOfIsEdit = new Set<any>();
  private setOfNew = new Set<any>();
  private mapOfBeforeEditValues = new Map<any, any>;
  metaData: MetaData = {
    url: '',
    keyFieldName: '',
    showSelect: false,
    showAction: false,
    showLoader: false,
    fields: [],
    details: []
  };

  constructor(private http: HttpClient, private message: NzMessageService, private modal: NzModalService) {}

  ngOnInit() {
    this.http.get<MetaData>(this.metaUrl)
      .subscribe({
        next: (value: MetaData) => this.metaData = value,
        error: (error) => {
          console.error(error)
          this.message.create('error', `Error: ${error.message}`);
        },
        complete: () => {
          this.metaData.fields.forEach((field) => {
            field.searchValue = '';
            field.isVisibleSearch = false;
          });
        }
      });
  }

  loadData() {
    this.loading = true;
    let params = new HttpParams().append('page', this.pageIndex - 1);
    params = params.append('size', this.pageSize);
    if (this.masterId) {
      params = params.append('masterId', this.masterId);
    }
    this.sort.filter((item) => item.value).forEach((item) => {
        params = params.append('sort', item.key + ',' + ('ascend' === item.value ? 'asc' : 'desc'));
    });
    this.metaData.fields.forEach((field) => {
      if (field.searchValue.length > 0) {
        if (field.type.name === 'lookup') {
          params = params.append('search', `${field.name}.${field.type.valFieldName}=${field.searchValue}`);
        } else {
          params = params.append('search', `${field.name}=${field.searchValue}`);
        }
      }
    });

    this.http.get<any>(this.metaData.url, {
      params: params
    }).subscribe({
      next: (value) => {
        this.recordSet = value.content;
        this.total = value.totalElements;
      }, error: (error) => console.error(error), complete: () => this.loading = false
    })
  }

  onQueryParams(params: NzTableQueryParams): void {
    if (this.metaData.url) {
      this.pageIndex = params.pageIndex;
      this.pageSize = params.pageSize;
      this.sort = params.sort;
      this.loadData();
    }
  }

  isEdit(row: any): boolean {
    return this.setOfIsEdit.has(row);
  }

  isChecked(row: any): boolean {
    return this.setOfCheckedId.has(row.id);
  }

  edit(row: any) {
    if (this.setOfIsEdit.has(row)) {
      this.setOfIsEdit.delete(row);
      const beforeEditRow = this.mapOfBeforeEditValues.get(row.id); //TODO id change to from meta data!!!
      for (const i in beforeEditRow) {
        row[i] = beforeEditRow[i];
      }
      this.mapOfBeforeEditValues.delete(row.id);
      if (this.setOfNew.has(row)) {
        this.deleteFromRecordSetByRow(row);
      }
    } else {
      this.setOfNew.delete(row);
      this.setOfIsEdit.add(row);
      this.mapOfBeforeEditValues.set(row.id, structuredClone(row));
    }
  }

  form(row: any) {
    this.formEdit.showDialog(row);
  }

  save(row: any) {
    if (this.masterId) {
      row[this.masterObjectName] = {};
      row[this.masterObjectName][this.masterFieldKey] = this.masterId; //TODO from meta?
    }
    this.http.post(this.metaData.url, row)
      .subscribe({
        next: (value: any) => {
          this.setOfIsEdit.delete(row);
          row[this.metaData.keyFieldName] = value.id;
          delete row.beforeEdit;
          if (this.recordSet.filter((item) => item.id === value.id).length == 0) {
            const rsData = this.recordSet;
            rsData.unshift(value);
            this.recordSet = rsData;
          }
          this.setOfNew.delete(value);
        }, error: (error) => {
          console.error(error);
          this.message.create('error', `Error: ${error.message}`);
        }, complete: () => {
          this.message.create('success', `Saved: ${row.id}`);
        }
      });
  }

  getFirstSelected(obj: any, row: any, field: Field): void {
    const selectedIds = [...this.setOfCheckedId.values()];
    if (selectedIds.length > 0) {
      const fieldType = field.type;
      const firstSelectedKey = selectedIds[0];
      const firstSelectedVal = this.recordSet.filter((item) => item[fieldType.keyFieldName] === firstSelectedKey).at(0)[fieldType.valFieldName];
      row[field.name] = {};
      row[field.name][fieldType.keyFieldName] = firstSelectedKey;
      row[field.name][fieldType.valFieldName] = firstSelectedVal;
      obj.data = {};
      obj.data[fieldType.keyFieldName] = firstSelectedKey;
      obj.data[fieldType.valFieldName] = firstSelectedVal;
    } else {
      row[field.name] = null;
      obj.data = null;
    }
    obj.onChange(obj.data);
  }

  delete(row: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this record?',
      nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        if (row.id !== null) {
          this.http.delete(`${this.metaData.url}?id=${row.id}`)
            .subscribe({
              error: (error) => {
                this.message.create('error', `Error: ${error.message}`);
              }, complete: () => {
                this.recordSet = this.recordSet.filter(d => d.id !== row.id);
                this.message.create('success', `Deleted: ${row.id}`);
              }
            });
        } else {
          this.deleteFromRecordSetByRow(row);
        }
      },
      nzCancelText: 'No',
      nzOnCancel: () => {
        console.log('Cancel')
      }
    });
  }

  deleteFromRecordSetByRow(row: any) {
    const data = this.recordSet;
    const index = data.indexOf(row);
    if (index !== -1) {
      data.splice(index, 1);
    }
    this.recordSet = data;
  }

  add() {
    const rsData = this.recordSet;
    const row: any = {id: uuidv4()}; //
    rsData.unshift(row);
    this.recordSet = rsData;
    this.setOfIsEdit.add(row)
    this.setOfNew.add(row);
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.recordSet.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange(recordSet: readonly any[]): void {
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.recordSet.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.recordSet.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  create() {
    const row = {id: uuidv4()};
    this.form(row);
  }

  search(field: Field): void {
    field.isVisibleSearch = false;
    this.loadData();
  }

  reset(field: Field): void {
    field.searchValue = '';
    this.search(field);
  }

}


