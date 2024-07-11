import { Component, OnInit } from '@angular/core';
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {TableComponent} from "../../components/table/table.component";

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './menu1.component.html',
  styleUrls: ['./menu1.component.css'],
  imports: [
    NzTableComponent,
    NzTableModule,
    TableComponent
  ]
})
export class Menu1Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}
