import {Lookup} from "./lookup";

export interface Field {
  name: string;
  label: string;
  type: string;
  editable: boolean;
  hidden: boolean;
  lookup: Lookup;
}
