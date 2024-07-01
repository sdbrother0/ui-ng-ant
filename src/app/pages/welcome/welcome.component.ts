import { Component, OnInit } from '@angular/core';
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {TableComponent} from "../../components/table/table.component";

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [
    NzTableComponent,
    NzTableModule,
    TableComponent
  ]
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
