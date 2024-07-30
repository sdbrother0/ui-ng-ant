export interface FieldType {
  name: string;
  //lookup
  valFieldName : string;
  keyFieldName: string;
  metaUrl: string;
  masterMapping: Map<any, any>;

  //date
  format: string
}

