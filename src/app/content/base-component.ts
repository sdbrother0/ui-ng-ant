import {Component, Input, OnInit} from '@angular/core';
import {TableComponent} from "../components/table/table-component";
import {
  NzContentComponent,
  NzFooterComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent
} from "ng-zorro-antd/layout";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzTableComponent} from "ng-zorro-antd/table";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {ActivatedRoute} from "@angular/router";
import {NgIf} from "@angular/common";
import {NzPageHeaderComponent} from "ng-zorro-antd/page-header";

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './base-component.html',
  imports: [
    TableComponent,
    NzLayoutComponent,
    NzSiderComponent,
    NzContentComponent,
    NzFlexDirective,
    NzRowDirective,
    NzColDirective,
    NzTableComponent,
    NzDividerComponent,
    NzHeaderComponent,
    NzFooterComponent,
    NgIf,
    NzPageHeaderComponent
  ],
  styleUrls: ['./base-component.css']
})
export class BaseComponent implements OnInit {
  @Input()
  metaUrl?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.metaUrl = data['metaUrl'];
    });
  }

}
