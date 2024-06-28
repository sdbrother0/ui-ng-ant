import {Field} from "./field";

export interface MetaData {
  url: string;
  keyFieldName: string;
  showSelect: boolean;
  showAction: boolean;
  showLoader: boolean;
  fields: Field[];
}
