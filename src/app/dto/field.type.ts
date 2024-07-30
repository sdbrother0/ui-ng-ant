export interface FieldType {
  name: string;
  //lookup
  valFieldName : string;
  keyFieldName: string;
  metaUrl: string;
  mapping: Map<any, any>;

  //date
  format: string
}

