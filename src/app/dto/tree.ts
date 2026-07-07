export interface Tree {
  // endpoint returning the tree node records
  url: string;
  // field name of the node id (primary key)
  keyFieldName: string;
  // field name displayed as the node title
  titleFieldName: string;
  // field name that references the parent node id (used to build the hierarchy)
  parentFieldName: string;
  // field name in the table row that holds the foreign key to a tree node
  fkFieldName: string;
}
