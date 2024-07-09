import {Field} from "./field";
import {Detail} from "./detail";

export interface MetaData {
  url: string;
  keyFieldName: string;
  showSelect: boolean;
  showAction: boolean;
  showLoader: boolean;
  fields: Field[];
  details: Detail[];
}
