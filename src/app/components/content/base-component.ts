import {Component, Input, OnInit} from '@angular/core';
import {TableComponent} from "../table/table-component";
import {ActivatedRoute} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-form',
    templateUrl: './base-component.html',
    imports: [
        TableComponent,
        NgIf,
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
