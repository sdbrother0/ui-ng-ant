import {FieldType} from "./field.type";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  editable: boolean;
  hidden: boolean;
  isVisibleSearch: boolean;
  searchValue: string;
}
