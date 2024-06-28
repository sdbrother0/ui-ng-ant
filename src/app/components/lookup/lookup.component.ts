import {Component, forwardRef, Injectable, Injector, Input, OnInit, ViewChild} from "@angular/core";
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {JsonPipe, NgForOf} from "@angular/common";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import { NzModalModule } from 'ng-zorro-antd/modal';
import {TableComponent} from "../table/table.component";
import {Lookup} from "../../dto/lookup";

@Component({
  host: { ngSkipHydration: 'true' },
  selector: 'lookup-data',
  standalone: true,
  templateUrl: './lookup.component.html',
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
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {

  @Input() data!: any;
  @Input() lookup!: Lookup;
  @Input() row!: any;
  @Input() field!: any;

  isVisible = false;

  @ViewChild('lookup_table') lookupTable: TableComponent;

  constructor(lookupTable: TableComponent) {
    this.lookupTable = lookupTable;
  }

  ngOnInit(): void {

  }

  openDialog(lookupMetaData: any, lookupData: any) {
    this.isVisible = true;
  }

  handleOk(data: any): void {
    console.log('Button ok clicked!');
    console.log(data);
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  showModal(): void {
    this.isVisible = true;
  }


}
