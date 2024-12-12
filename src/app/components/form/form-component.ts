import {Component, Input, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AppLoaderService} from "../../service/app.loader.service";
import {ExecutionResult} from "../../dto/execution.result";

@Component({
  selector: 'form-component',
  templateUrl: './form-component.html',
  styleUrls: ['./form-component.css'],
  imports: [FormsModule, ReactiveFormsModule]
})
export class FormComponent implements OnInit {

  @Input() metaUrl!: string | undefined;

  mapData: Map<string, string> = new Map<string, string>();

  constructor(private appLoaderService: AppLoaderService, private http: HttpClient) {
  }

  ngOnInit(): void {

  }

  sendComponents(source: string) {
    const res: { [index: string]: any } = {};
    this.mapData.forEach((value, key) => {
      res[key] = value;
    })

    this.http.post<ExecutionResult>(this.appLoaderService.API_URL + this.metaUrl, {
      source: source, data: res
    })
      .subscribe({
        next: (response: ExecutionResult) => {
          this.mapData = new Map(Object.entries(response.result));
        }, error: (error) => {
          console.error(error);
        }
      });
  }
}
