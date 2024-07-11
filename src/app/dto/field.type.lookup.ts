import {FieldType} from "./field.type";

export interface FieldTypeLookup extends FieldType {
  valFieldName : string;
  keyFieldName: string;
  metaUrl: string;
}

