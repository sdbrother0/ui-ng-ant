import {Field} from "./field";
import {Detail} from "./detail";
import {Report} from "./report";
import {Tree} from "./tree";

export interface MetaData {
  name: string;
  key: string;
  url: string;
  fields: Field[];
  details: Detail[];
  reports: Report[];
  tree?: Tree;
}

