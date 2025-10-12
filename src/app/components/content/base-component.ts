import {Component, Input, OnInit} from '@angular/core';
import {TableComponent} from "../table/table-component";
import {ActivatedRoute} from "@angular/router";
import {NgIf} from "@angular/common";
import {FormComponent} from "../form/form-component";

@Component({
    selector: 'app-form',
    templateUrl: './base-component.html',
  imports: [
    TableComponent,
    FormComponent,
  ],
    styleUrls: ['./base-component.css']
})
export class BaseComponent implements OnInit {
  @Input()
  metaUrl?: string;
  @Input()
  type?: string;


  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.metaUrl = data['metaUrl'];
      this.type = data['type'];
    });
  }

}
