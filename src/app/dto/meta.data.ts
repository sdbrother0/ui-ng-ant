import {Field} from "./field";
import {Detail} from "./detail";
import {Report} from "./report";

export interface MetaData {
  name: string;
  key: string;
  url: string;
  showSelect: boolean;
  showAction: boolean;
  showLoader: boolean;
  fields: Field[];
  details: Detail[];
  reports: Report[];
}

