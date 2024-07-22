import { Component, OnInit } from '@angular/core';
import {NzDemoTreeViewDirectoryComponent} from "../../components/tree/tree.component";
import {TableComponent} from "../../components/table/table.component";
import {NzContentComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzTableComponent} from "ng-zorro-antd/table";
import {NzDividerComponent} from "ng-zorro-antd/divider";

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './menu3.component.html',
  imports: [
    NzDemoTreeViewDirectoryComponent,
    TableComponent,
    NzLayoutComponent,
    NzSiderComponent,
    NzContentComponent,
    NzFlexDirective,
    NzRowDirective,
    NzColDirective,
    NzTableComponent,
    NzDividerComponent
  ],
  styleUrls: ['./menu3.component.css']
})
export class Menu3Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}
