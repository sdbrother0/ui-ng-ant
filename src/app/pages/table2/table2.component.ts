import { Component, OnInit } from '@angular/core';
import {TableComponent} from "../../components/table/table.component";

@Component({
  selector: 'app-monitor',
  standalone: true,
  templateUrl: './table2.component.html',
  imports: [
    TableComponent
  ],
  styleUrls: ['./table2.component.css']
})
export class Table2Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}
