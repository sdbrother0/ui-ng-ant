import { Component, OnInit } from '@angular/core';
import {NzDemoTreeViewDirectoryComponent} from "../../components/tree/tree.component";

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './menu3.component.html',
  imports: [
    NzDemoTreeViewDirectoryComponent
  ],
  styleUrls: ['./menu3.component.css']
})
export class Menu3Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}
