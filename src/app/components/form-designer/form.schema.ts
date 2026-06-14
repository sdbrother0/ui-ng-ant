export type ControlType = 'button' | 'label' | 'input' | 'textarea' | 'toggle' | 'checkbox' | 'select' | 'table' | 'lookup';

export interface TableColumn {
  key: string;
  title: string;
}

export interface ControlProps {
  text?: string;
  color?: string;
  fontSize?: number;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  checked?: boolean;
  options?: string[];
  btnType?: 'primary' | 'default' | 'dashed' | 'link';
  columns?: TableColumn[];
  rows?: Record<string, any>[];
  // lookup
  metaUrl?: string;
  keyField?: string;
  valueField?: string;
  lookupValue?: any;
  displayValue?: string;
}

export interface ControlDef {
  id: string;
  name: string;
  type: ControlType;
  x: number;
  y: number;
  width: number;
  height: number;
  props: ControlProps;
}

export interface FormSchema {
  id: string;
  name: string;
  width: number;
  height: number;
  controls: ControlDef[];
}

export interface WsButtonClick {
  type: 'button_click';
  formId: string;
  controlId: string;
  controlName: string;
}

export interface WsTableRowSelect {
  type: 'table_row_select';
  formId: string;
  controlId: string;
  controlName: string;
  rowIndex: number;
  rowData: Record<string, any>;
}

export interface WsInputChange {
  type: 'input_change';
  formId: string;
  controlId: string;
  controlName: string;
  value: string;
}

export interface WsToggleChange {
  type: 'toggle_change';
  formId: string;
  controlId: string;
  controlName: string;
  checked: boolean;
}

export interface WsUpdateControl {
  type: 'update_control';
  controlId: string;
  props?: Partial<ControlProps>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface WsUpdateForm {
  type: 'update_form';
  schema: FormSchema;
}

export type WsMessage =
  | WsButtonClick
  | WsTableRowSelect
  | WsInputChange
  | WsToggleChange
  | WsUpdateControl
  | WsUpdateForm
  | { type: string; [key: string]: any };
