import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy} from '@angular/core';
import {NzTreeModule, NzTreeNode, NzTreeNodeOptions, NzFormatEmitEvent} from "ng-zorro-antd/tree";
import {HttpClient} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd/message";
import {FormsModule} from "@angular/forms";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {AppLoaderService} from "../../service/app.loader.service";
import {Tree} from "../../dto/tree";

@Component({
  host: {ngSkipHydration: 'true'},
  selector: 'tree-component',
  templateUrl: './tree-component.html',
  styleUrls: ['./tree-component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NzTreeModule, FormsModule, NzInputDirective, NzButtonComponent, NzIconDirective, NzTooltipDirective, NzPopconfirmDirective]
})
export class TreeComponent implements OnInit {

  private readonly NEW_KEY = '__new_node__';

  @Input() tree!: Tree;
  @Output() selectNode = new EventEmitter<any>();

  nodes: NzTreeNodeOptions[] = [];
  expandedKeys: string[] = [];
  selectedKeys: string[] = [];
  loading: boolean = true;

  editingKey: string | null = null;
  editingTitle: string = '';

  constructor(private appLoaderService: AppLoaderService, private http: HttpClient, private message: NzMessageService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.http.get<any>(this.appLoaderService.API_URL + this.tree.url)
      .subscribe({
        next: (value) => {
          const records = Array.isArray(value) ? value : value.content;
          this.nodes = this.buildTree(records ?? []);
          this.expandedKeys = this.collectKeys(this.nodes);
        },
        error: (error) => {
          console.error(error);
          this.message.create('error', `Error: ${error.message}`);
        },
        complete: () => this.loading = false
      });
  }

  buildTree(records: any[]): NzTreeNodeOptions[] {
    const map = new Map<any, NzTreeNodeOptions>();
    const roots: NzTreeNodeOptions[] = [];
    records.forEach((record) => {
      map.set(record[this.tree.keyFieldName], {
        key: String(record[this.tree.keyFieldName]),
        title: record[this.tree.titleFieldName],
        children: [],
        origin: record,
        parentRecordId: record[this.tree.parentFieldName] ?? null
      } as NzTreeNodeOptions);
    });
    records.forEach((record) => {
      const node = map.get(record[this.tree.keyFieldName])!;
      const parentKey = record[this.tree.parentFieldName];
      const parent = parentKey != null ? map.get(parentKey) : undefined;
      if (parent) {
        parent.children!.push(node);
      } else {
        roots.push(node);
      }
    });
    map.forEach((node) => node.isLeaf = !node.children || node.children.length === 0);
    return roots;
  }

  onSelect(event: NzFormatEmitEvent): void {
    const node = event.node;
    // node.key holds the tree node id (see buildTree); emit it when the node is
    // selected, or null when it is toggled off so the table shows all rows again
    if (node && node.isSelected) {
      this.selectedKeys = [node.key];
      this.selectNode.emit(node.key);
    } else {
      this.selectedKeys = [];
      this.selectNode.emit(null);
    }
  }

  clearSelection(): void {
    this.selectedKeys = [];
    this.selectNode.emit(null);
  }

  // ---- editing ---------------------------------------------------------------

  addRoot(): void {
    this.discardNewNode();
    const temp = this.createTempNode(null);
    this.nodes = [...this.nodes, temp];
    this.startEditNode(temp);
  }

  addChild(treeNode: NzTreeNode): void {
    this.discardNewNode();
    const parent = this.findNode(treeNode.key);
    if (!parent) {
      return;
    }
    const temp = this.createTempNode(parent['origin'][this.tree.keyFieldName]);
    parent.children = [...(parent.children ?? []), temp];
    parent.isLeaf = false;
    if (!this.expandedKeys.includes(parent.key)) {
      this.expandedKeys = [...this.expandedKeys, parent.key];
    }
    this.nodes = [...this.nodes];
    this.startEditNode(temp);
  }

  startEdit(treeNode: NzTreeNode): void {
    const node = this.findNode(treeNode.key);
    if (node) {
      this.startEditNode(node);
    }
  }

  cancelEdit(treeNode: NzTreeNode): void {
    const node = this.findNode(treeNode.key);
    if (node && (node as any).isNew) {
      this.removeNode(node.key);
    }
    this.editingKey = null;
    this.nodes = [...this.nodes];
  }

  saveEdit(treeNode: NzTreeNode): void {
    const node = this.findNode(treeNode.key);
    if (!node) {
      return;
    }
    const title = (this.editingTitle ?? '').trim();
    if (!title) {
      this.message.create('error', 'Title is required');
      return;
    }
    const isNew = !!(node as any).isNew;
    const record: any = isNew ? {} : {...node['origin']};
    record[this.tree.titleFieldName] = title;
    record[this.tree.parentFieldName] = (node as any).parentRecordId ?? null;

    this.http.post<any>(this.appLoaderService.API_URL + this.tree.url, record)
      .subscribe({
        next: (saved) => {
          node['origin'] = saved;
          node.key = String(saved[this.tree.keyFieldName]);
          node.title = saved[this.tree.titleFieldName];
          (node as any).parentRecordId = saved[this.tree.parentFieldName] ?? null;
          (node as any).isNew = false;
          this.editingKey = null;
          this.nodes = [...this.nodes];
          this.message.create('success', `Saved: ${node.title}`);
        },
        error: (error) => {
          console.error(error);
          this.message.create('error', `Error: ${error.message}`);
        }
      });
  }

  delete(treeNode: NzTreeNode): void {
    const node = this.findNode(treeNode.key);
    if (!node) {
      return;
    }
    if ((node as any).isNew) {
      this.removeNode(node.key);
      this.editingKey = null;
      this.nodes = [...this.nodes];
      return;
    }
    const id = node['origin'][this.tree.keyFieldName];
    this.http.delete(`${this.appLoaderService.API_URL + this.tree.url}?id=${id}`)
      .subscribe({
        next: () => {
        },
        error: (error) => {
          console.error(error);
          this.message.create('error', `Error: ${error.message}`);
        },
        complete: () => {
          if (this.selectedKeys.includes(node.key)) {
            this.selectedKeys = [];
            this.selectNode.emit(null);
          }
          this.removeNode(node.key);
          this.nodes = [...this.nodes];
          this.message.create('success', `Deleted: ${id}`);
        }
      });
  }

  isEditing(treeNode: NzTreeNode): boolean {
    return this.editingKey === treeNode.key;
  }

  // ---- helpers ---------------------------------------------------------------

  private createTempNode(parentRecordId: any): NzTreeNodeOptions {
    return {
      key: this.NEW_KEY,
      title: '',
      children: [],
      isLeaf: true,
      origin: {},
      isNew: true,
      parentRecordId: parentRecordId
    } as NzTreeNodeOptions;
  }

  private startEditNode(node: NzTreeNodeOptions): void {
    this.editingKey = node.key;
    this.editingTitle = node.title;
  }

  private discardNewNode(): void {
    if (this.editingKey === this.NEW_KEY) {
      this.removeNode(this.NEW_KEY);
    }
    this.editingKey = null;
  }

  private findNode(key: string, list: NzTreeNodeOptions[] = this.nodes): NzTreeNodeOptions | undefined {
    for (const node of list) {
      if (node.key === key) {
        return node;
      }
      const found = node.children && this.findNode(key, node.children);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  private removeNode(key: string, list: NzTreeNodeOptions[] = this.nodes): boolean {
    const index = list.findIndex((node) => node.key === key);
    if (index !== -1) {
      list.splice(index, 1);
      return true;
    }
    for (const node of list) {
      if (node.children && this.removeNode(key, node.children)) {
        node.isLeaf = node.children.length === 0;
        return true;
      }
    }
    return false;
  }

  private collectKeys(list: NzTreeNodeOptions[]): string[] {
    const keys: string[] = [];
    list.forEach((node) => {
      keys.push(node.key);
      if (node.children && node.children.length) {
        keys.push(...this.collectKeys(node.children));
      }
    });
    return keys;
  }

}
