import {
  Component, Input, OnInit, OnDestroy, OnChanges,
  SimpleChanges, ChangeDetectorRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subscription } from 'rxjs';
import { ControlDef, FormSchema, WsUpdateControl, WsUpdateForm } from './form.schema';
import { FormWsService } from './form-ws.service';
import { AppLoaderService } from '../../service/app.loader.service';

interface LookupState {
  open: boolean;
  loading: boolean;
  rows: Record<string, any>[];
  columns: { key: string; title: string }[];
}

@Component({
  selector: 'app-form-runtime',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    NzButtonModule, NzSwitchModule, NzCheckboxModule,
    NzSelectModule, NzInputModule, NzTableModule, NzTagModule,
    NzModalModule, NzIconModule,
  ],
  providers: [FormWsService],
  template: `
    <div class="runtime-root" [style.width.px]="schema.width" [style.height.px]="schema.height + 28">
      <div class="ws-bar">
        <span class="dot" [class.connected]="ws.isConnected"></span>
        {{ ws.isConnected ? 'Connected' : (ws.connectionError || 'Connecting…') }}
      </div>
      <div class="canvas" [style.width.px]="schema.width" [style.height.px]="schema.height">
        @for (ctrl of schema.controls; track ctrl.id) {
          <div class="rt-ctrl" [style.left.px]="ctrl.x" [style.top.px]="ctrl.y"
               [style.width.px]="ctrl.width" [style.height.px]="ctrl.height">
            @switch (ctrl.type) {
              @case ('button') {
                <button nz-button [nzType]="ctrl.props.btnType || 'default'"
                        [disabled]="!!ctrl.props.disabled"
                        style="width:100%;height:100%"
                        (click)="onButtonClick(ctrl)">
                  {{ ctrl.props.text || ctrl.name }}
                </button>
              }
              @case ('label') {
                <span [style.color]="ctrl.props.color"
                      [style.font-size.px]="ctrl.props.fontSize || 14">
                  {{ ctrl.props.text || ctrl.name }}
                </span>
              }
              @case ('input') {
                <input nz-input style="width:100%;height:100%"
                       [placeholder]="ctrl.props.placeholder || ''"
                       [disabled]="!!ctrl.props.disabled"
                       [(ngModel)]="ctrl.props.value"
                       (ngModelChange)="onInputChange(ctrl, $event)" />
              }
              @case ('textarea') {
                <textarea nz-input style="width:100%;height:100%"
                          [placeholder]="ctrl.props.placeholder || ''"
                          [disabled]="!!ctrl.props.disabled"
                          [(ngModel)]="ctrl.props.value"
                          (ngModelChange)="onInputChange(ctrl, $event)"></textarea>
              }
              @case ('toggle') {
                <div class="toggle-wrap">
                  <nz-switch [(ngModel)]="ctrl.props.checked"
                             [nzDisabled]="!!ctrl.props.disabled"
                             (ngModelChange)="onToggleChange(ctrl, $event)"></nz-switch>
                  @if (ctrl.props.text) {
                    <span class="toggle-label">{{ ctrl.props.text }}</span>
                  }
                </div>
              }
              @case ('checkbox') {
                <label nz-checkbox [(ngModel)]="ctrl.props.checked"
                       [nzDisabled]="!!ctrl.props.disabled"
                       (ngModelChange)="onToggleChange(ctrl, $event)">
                  {{ ctrl.props.text || ctrl.name }}
                </label>
              }
              @case ('select') {
                <nz-select style="width:100%" [(ngModel)]="ctrl.props.value"
                           [nzDisabled]="!!ctrl.props.disabled"
                           (ngModelChange)="onInputChange(ctrl, $event)">
                  @for (opt of (ctrl.props.options || []); track opt) {
                    <nz-option [nzValue]="opt" [nzLabel]="opt"></nz-option>
                  }
                </nz-select>
              }
              @case ('table') {
                <nz-table [nzData]="ctrl.props.rows || []" nzSize="small"
                          style="width:100%" [nzScroll]="{y: (ctrl.height - 40) + 'px'}"
                          [nzShowPagination]="false">
                  <thead>
                    <tr>
                      @for (col of (ctrl.props.columns || []); track col.key) {
                        <th>{{ col.title }}</th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of ctrl.props.rows || []; track $index; let i = $index) {
                      <tr class="rt-table-row" (click)="onTableRowSelect(ctrl, i, row)">
                        @for (col of (ctrl.props.columns || []); track col.key) {
                          <td>{{ row[col.key] }}</td>
                        }
                      </tr>
                    }
                  </tbody>
                </nz-table>
              }
              @case ('lookup') {
                <nz-input-group [nzSuffix]="lookupBtn" style="width:100%">
                  <input nz-input [value]="ctrl.props.displayValue || ''"
                         [disabled]="!!ctrl.props.disabled"
                         readonly placeholder="Select…" style="cursor:pointer"
                         (click)="openLookup(ctrl)" />
                </nz-input-group>
                <ng-template #lookupBtn>
                  <span nz-icon nzType="search" style="cursor:pointer;color:rgba(0,0,0,.45)"
                        (click)="openLookup(ctrl)"></span>
                </ng-template>

                <!-- Lookup modal -->
                <nz-modal
                  [nzVisible]="lookupState[ctrl.id]?.open"
                  nzTitle="Select value"
                  nzWidth="700"
                  [nzFooter]="null"
                  (nzOnCancel)="closeLookup(ctrl)">
                  <ng-container *nzModalContent>
                    @if (lookupState[ctrl.id]?.loading) {
                      <div style="text-align:center;padding:24px">Loading…</div>
                    } @else {
                      <nz-table [nzData]="lookupState[ctrl.id]?.rows || []"
                                nzSize="small" [nzScroll]="{y:'360px'}"
                                [nzShowPagination]="true" [nzPageSize]="20">
                        <thead>
                          <tr>
                            @for (col of lookupState[ctrl.id]?.columns || []; track col.key) {
                              <th>{{ col.title }}</th>
                            }
                          </tr>
                        </thead>
                        <tbody>
                          @for (row of lookupState[ctrl.id]?.rows || []; track $index; let i = $index) {
                            <tr class="rt-table-row" (click)="onLookupSelect(ctrl, row)">
                              @for (col of lookupState[ctrl.id]?.columns || []; track col.key) {
                                <td>{{ row[col.key] }}</td>
                              }
                            </tr>
                          }
                        </tbody>
                      </nz-table>
                    }
                  </ng-container>
                </nz-modal>
              }
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .runtime-root { position: relative; background: #fff; }
    .ws-bar {
      display: flex; align-items: center; gap: 6px;
      padding: 4px 8px; background: #f5f5f5;
      font-size: 12px; border-bottom: 1px solid #e8e8e8;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; }
    .dot.connected { background: #52c41a; }
    .canvas { position: relative; overflow: hidden; }
    .rt-ctrl { position: absolute; display: flex; align-items: flex-start; }
    .toggle-wrap { display: flex; align-items: center; gap: 8px; height: 100%; }
    .toggle-label { font-size: 14px; }
    .rt-table-row { cursor: pointer; }
    .rt-table-row:hover td { background: #e6f7ff !important; }
  `]
})
export class FormRuntimeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() schema!: FormSchema;
  @Input() wsUrl = '';

  ws = inject(FormWsService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private loader = inject(AppLoaderService);
  private sub?: Subscription;

  lookupState: Record<string, LookupState> = {};

  ngOnInit(): void {
    this.startWs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wsUrl'] && !changes['wsUrl'].firstChange) {
      this.startWs();
    }
  }

  private startWs(): void {
    this.sub?.unsubscribe();
    if (this.wsUrl) {
      this.ws.connect(this.wsUrl);
      this.sub = this.ws.messages.subscribe(msg => this.handleMsg(msg as any));
    }
  }

  private handleMsg(msg: { type: string } & any): void {
    if (msg.type === 'update_control') {
      const m = msg as WsUpdateControl;
      const ctrl = this.schema.controls.find(c => c.id === m.controlId);
      if (ctrl) {
        if (m.props) Object.assign(ctrl.props, m.props);
        if (m.x !== undefined) ctrl.x = m.x;
        if (m.y !== undefined) ctrl.y = m.y;
        if (m.width !== undefined) ctrl.width = m.width;
        if (m.height !== undefined) ctrl.height = m.height;
      }
    } else if (msg.type === 'update_form') {
      const m = msg as WsUpdateForm;
      this.schema = { ...m.schema, controls: m.schema.controls.map(c => ({ ...c, props: { ...c.props } })) };
    }
    this.cdr.markForCheck();
  }

  // ── Lookup ──

  openLookup(ctrl: ControlDef): void {
    if (ctrl.props.disabled) return;
    if (!this.lookupState[ctrl.id]) {
      this.lookupState[ctrl.id] = { open: false, loading: false, rows: [], columns: [] };
    }
    this.lookupState[ctrl.id].open = true;
    this.loadLookupData(ctrl);
  }

  closeLookup(ctrl: ControlDef): void {
    if (this.lookupState[ctrl.id]) this.lookupState[ctrl.id].open = false;
  }

  private loadLookupData(ctrl: ControlDef): void {
    const state = this.lookupState[ctrl.id];
    if (state.rows.length) return;
    const metaUrl = ctrl.props.metaUrl;
    if (!metaUrl) return;
    state.loading = true;
    const url = metaUrl.startsWith('http') ? metaUrl : this.loader.API_URL + metaUrl;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        const rows: Record<string, any>[] = Array.isArray(data) ? data : (data?.rows ?? data?.data ?? []);
        state.rows = rows;
        state.columns = rows.length
          ? Object.keys(rows[0]).map(k => ({ key: k, title: k }))
          : (ctrl.props.keyField && ctrl.props.valueField
              ? [{ key: ctrl.props.keyField, title: ctrl.props.keyField },
                 { key: ctrl.props.valueField, title: ctrl.props.valueField }]
              : []);
        state.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { state.loading = false; this.cdr.markForCheck(); }
    });
  }

  onLookupSelect(ctrl: ControlDef, row: Record<string, any>): void {
    const keyField   = ctrl.props.keyField   ?? 'id';
    const valueField = ctrl.props.valueField ?? 'name';
    ctrl.props.lookupValue   = row[keyField];
    ctrl.props.displayValue  = String(row[valueField] ?? row[keyField] ?? '');
    this.closeLookup(ctrl);
    this.ws.send({
      type: 'lookup_select',
      formId: this.schema.id,
      controlId: ctrl.id,
      controlName: ctrl.name,
      key: ctrl.props.lookupValue,
      value: ctrl.props.displayValue,
      row,
    });
    this.cdr.markForCheck();
  }

  // ── Other controls ──

  onButtonClick(ctrl: ControlDef): void {
    this.ws.send({ type: 'button_click', formId: this.schema.id, controlId: ctrl.id, controlName: ctrl.name });
  }

  onInputChange(ctrl: ControlDef, value: string): void {
    this.ws.send({ type: 'input_change', formId: this.schema.id, controlId: ctrl.id, controlName: ctrl.name, value });
  }

  onToggleChange(ctrl: ControlDef, checked: boolean): void {
    this.ws.send({ type: 'toggle_change', formId: this.schema.id, controlId: ctrl.id, controlName: ctrl.name, checked });
  }

  onTableRowSelect(ctrl: ControlDef, rowIndex: number, rowData: Record<string, any>): void {
    this.ws.send({ type: 'table_row_select', formId: this.schema.id, controlId: ctrl.id, controlName: ctrl.name, rowIndex, rowData });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.ws.disconnect();
  }
}
