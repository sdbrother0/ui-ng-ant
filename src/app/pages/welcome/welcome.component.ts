import { Component, OnInit } from '@angular/core';
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {TableComponent} from "../../components/table/table.component";

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [
    NzTableComponent,
    NzTableModule,
    TableComponent
  ],
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
