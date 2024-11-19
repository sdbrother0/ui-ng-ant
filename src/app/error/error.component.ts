import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';

@Component({
  selector: 'error-component',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzLayoutModule, NzMenuModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})

export class ErrorComponent {

}
