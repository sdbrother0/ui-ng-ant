import {
  Component, OnDestroy, HostListener, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ControlDef, ControlType, FormSchema } from './form.schema';
import { FormRuntimeComponent } from './form-runtime.component';

interface PaletteItem { type: ControlType; label: string; icon: string; }

interface DragState {
  kind: 'move' | 'resize';
  ctrlId: string;
  startMouseX: number;
  startMouseY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
  handle?: string;
}

const PALETTE: PaletteItem[] = [
  { type: 'button',   label: 'Button',   icon: '▣' },
  { type: 'label',    label: 'Label',    icon: 'A' },
  { type: 'input',    label: 'Input',    icon: '▭' },
  { type: 'textarea', label: 'Textarea', icon: '▬' },
  { type: 'toggle',   label: 'Toggle',   icon: '⊙' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑' },
  { type: 'select',   label: 'Select',   icon: '▾' },
  { type: 'table',    label: 'Table',    icon: '⊞' },
  { type: 'lookup',   label: 'Lookup',   icon: '🔍' },
];

const DEFAULTS: Record<ControlType, Partial<ControlDef>> = {
  button:   { width: 120, height: 32, props: { text: 'Button', btnType: 'default' } },
  label:    { width: 120, height: 24, props: { text: 'Label', fontSize: 14 } },
  input:    { width: 160, height: 32, props: { placeholder: 'Input…' } },
  textarea: { width: 200, height: 80, props: { placeholder: 'Text…' } },
  toggle:   { width: 80,  height: 32, props: { checked: false, text: '' } },
  checkbox: { width: 120, height: 24, props: { checked: false, text: 'Checkbox' } },
  select:   { width: 160, height: 32, props: { options: ['Option 1', 'Option 2'], value: '' } },
  lookup:   { width: 200, height: 32, props: {
    metaUrl: '/api/lookup', keyField: 'id', valueField: 'name', displayValue: '', lookupValue: null
  }},
  table:    { width: 320, height: 200, props: {
    columns: [{ key: 'id', title: 'ID' }, { key: 'name', title: 'Name' }],
    rows: [{ id: 1, name: 'Row 1' }, { id: 2, name: 'Row 2' }]
  }},
};

let _idCounter = 1;
function newId(): string { return 'ctrl_' + (_idCounter++); }

@Component({
  selector: 'app-form-designer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule, FormsModule,
    NzButtonModule, NzInputModule, NzInputNumberModule, NzSelectModule,
    NzSwitchModule, NzCheckboxModule, NzDividerModule, NzTagModule, NzTooltipModule,
    FormRuntimeComponent,
  ],
  templateUrl: './form-designer.component.html',
  styleUrl: './form-designer.component.css',
})
export class FormDesignerComponent implements OnDestroy {
  readonly palette = PALETTE;

  schema: FormSchema = {
    id: 'form_1', name: 'New Form', width: 800, height: 560, controls: []
  };

  mode: 'design' | 'runtime' = 'design';
  selectedId: string | null = null;
  wsUrl = 'ws://localhost:8080/ws/form/form_1';

  // palette drag
  dragPaletteType: ControlType | null = null;

  // canvas drag/resize
  private dragState: DragState | null = null;
  private boundMouseMove = this.onDocMouseMove.bind(this);
  private boundMouseUp = this.onDocMouseUp.bind(this);

  // columns json edit string
  columnsJson = '';
  rowsJson = '';

  constructor(private cdr: ChangeDetectorRef, private msg: NzMessageService) {}

  // ---- Getters ----

  get selected(): ControlDef | null {
    return this.schema.controls.find(c => c.id === this.selectedId) ?? null;
  }

  get selectedOptions(): string {
    return (this.selected?.props.options ?? []).join('\n');
  }

  set selectedOptions(val: string) {
    if (this.selected) {
      this.selected.props.options = val.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }

  // ---- Palette drag-and-drop ----

  onPaletteDragStart(e: DragEvent, type: ControlType): void {
    this.dragPaletteType = type;
    e.dataTransfer?.setData('text/plain', type);
  }

  onCanvasDragOver(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  }

  onCanvasDrop(e: DragEvent, canvas: HTMLElement): void {
    e.preventDefault();
    const type = (e.dataTransfer?.getData('text/plain') ?? this.dragPaletteType) as ControlType;
    if (!type) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    this.addControl(type, x, y);
    this.dragPaletteType = null;
  }

  private addControl(type: ControlType, x: number, y: number): void {
    const def = DEFAULTS[type];
    const ctrl: ControlDef = {
      id: newId(),
      name: type + '_' + _idCounter,
      type,
      x: Math.max(0, x - (def.width ?? 120) / 2),
      y: Math.max(0, y - (def.height ?? 32) / 2),
      width: def.width ?? 120,
      height: def.height ?? 32,
      props: JSON.parse(JSON.stringify(def.props ?? {})),
    };
    this.schema.controls.push(ctrl);
    this.selectedId = ctrl.id;
  }

  // ---- Control selection ----

  selectControl(e: MouseEvent, ctrl: ControlDef): void {
    e.stopPropagation();
    this.selectedId = ctrl.id;
  }

  deselectAll(): void {
    this.selectedId = null;
  }

  // ---- Keyboard ----

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if ((e.key === 'Delete' || e.key === 'Backspace') &&
        this.selectedId && this.mode === 'design' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)) {
      this.deleteSelected();
    }
  }

  deleteSelected(): void {
    if (!this.selectedId) return;
    this.schema.controls = this.schema.controls.filter(c => c.id !== this.selectedId);
    this.selectedId = null;
  }

  // ---- Move (mouse drag on canvas) ----

  onCtrlMouseDown(e: MouseEvent, ctrl: ControlDef): void {
    if (this.mode !== 'design') return;
    e.preventDefault();
    e.stopPropagation();
    this.selectedId = ctrl.id;
    this.dragState = {
      kind: 'move', ctrlId: ctrl.id,
      startMouseX: e.clientX, startMouseY: e.clientY,
      origX: ctrl.x, origY: ctrl.y, origW: ctrl.width, origH: ctrl.height,
    };
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  // ---- Resize ----

  onHandleMouseDown(e: MouseEvent, ctrl: ControlDef, handle: string): void {
    if (this.mode !== 'design') return;
    e.preventDefault();
    e.stopPropagation();
    this.dragState = {
      kind: 'resize', ctrlId: ctrl.id, handle,
      startMouseX: e.clientX, startMouseY: e.clientY,
      origX: ctrl.x, origY: ctrl.y, origW: ctrl.width, origH: ctrl.height,
    };
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  private onDocMouseMove(e: MouseEvent): void {
    if (!this.dragState) return;
    const ds = this.dragState;
    const ctrl = this.schema.controls.find(c => c.id === ds.ctrlId);
    if (!ctrl) return;
    const dx = e.clientX - ds.startMouseX;
    const dy = e.clientY - ds.startMouseY;
    if (ds.kind === 'move') {
      ctrl.x = Math.max(0, ds.origX + dx);
      ctrl.y = Math.max(0, ds.origY + dy);
    } else {
      this.applyResize(ctrl, ds, dx, dy);
    }
    this.cdr.markForCheck();
  }

  private applyResize(ctrl: ControlDef, ds: DragState, dx: number, dy: number): void {
    const MIN = 20;
    const h = ds.handle!;
    if (h.includes('e')) ctrl.width  = Math.max(MIN, ds.origW + dx);
    if (h.includes('s')) ctrl.height = Math.max(MIN, ds.origH + dy);
    if (h.includes('w')) {
      const nw = Math.max(MIN, ds.origW - dx);
      ctrl.x = ds.origX + (ds.origW - nw);
      ctrl.width = nw;
    }
    if (h.includes('n')) {
      const nh = Math.max(MIN, ds.origH - dy);
      ctrl.y = ds.origY + (ds.origH - nh);
      ctrl.height = nh;
    }
  }

  private onDocMouseUp(): void {
    this.dragState = null;
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
  }

  // ---- Schema JSON export/import ----

  copySchema(): void {
    navigator.clipboard.writeText(JSON.stringify(this.schema, null, 2));
    this.msg.success('Schema copied to clipboard');
  }

  pasteSchema(): void {
    navigator.clipboard.readText().then(text => {
      try {
        this.schema = JSON.parse(text);
        this.selectedId = null;
        this.msg.success('Schema loaded');
      } catch {
        this.msg.error('Invalid JSON');
      }
    });
  }

  // ---- Mode ----

  toggleMode(): void {
    this.mode = this.mode === 'design' ? 'runtime' : 'design';
    this.selectedId = null;
  }

  // ---- Z-order ----

  bringForward(): void {
    if (!this.selectedId) return;
    const arr = this.schema.controls;
    const i = arr.findIndex(c => c.id === this.selectedId);
    if (i < arr.length - 1) { [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; }
  }

  sendBackward(): void {
    if (!this.selectedId) return;
    const arr = this.schema.controls;
    const i = arr.findIndex(c => c.id === this.selectedId);
    if (i > 0) { [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]; }
  }

  trySetColumns(ctrl: ControlDef, json: string): void {
    try { ctrl.props.columns = JSON.parse(json); } catch {}
  }

  trySetRows(ctrl: ControlDef, json: string): void {
    try { ctrl.props.rows = JSON.parse(json); } catch {}
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
  }
}
