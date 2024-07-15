import {Field} from "./field";
import {Detail} from "./detail";

export interface MetaData {
  name: string;
  key: string;
  url: string;
  showSelect: boolean;
  showAction: boolean;
  showLoader: boolean;
  fields: Field[];
  details: Detail[];
}

