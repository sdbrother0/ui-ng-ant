import { Component, OnInit } from '@angular/core';
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";

@Component({
  host: { ngSkipHydration: 'true' },
  selector: 'table-data',
  standalone: true,
  templateUrl: './table.component.html',
  imports: [
    NzTableModule,
    NzTableComponent
  ],
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
