import { Component, OnInit } from '@angular/core';
import {TableComponent} from "../../components/table/table.component";

@Component({
  selector: 'app-monitor',
  standalone: true,
  templateUrl: './menu2.component.html',
  imports: [
    TableComponent
  ],
  styleUrls: ['./menu2.component.css']
})
export class Menu2Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}
