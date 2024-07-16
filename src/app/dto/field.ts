import {FieldType} from "./field.type";
import {Validation} from "./validation";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  editable: boolean;
  hidden: boolean;
  isVisibleSearch: boolean;
  searchValue: string;
  validation: Validation;
}
