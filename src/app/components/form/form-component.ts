import {Component, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'form-component',
  templateUrl: './form-component.html',
  styleUrls: ['./form-component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, ReactiveFormsModule]
})
export class FormComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

  }

}
