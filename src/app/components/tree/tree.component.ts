import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component } from '@angular/core';

import {
  NzTreeNodeComponent, NzTreeNodeDefDirective,
  NzTreeNodeNoopToggleDirective, NzTreeNodeOptionComponent, NzTreeNodePaddingDirective,
  NzTreeNodeToggleDirective, NzTreeNodeToggleRotateIconDirective, NzTreeViewComponent

} from 'ng-zorro-antd/tree-view';
import {NzIconDirective} from "ng-zorro-antd/icon";

interface FoodNode {
  name: string;
  disabled?: boolean;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana', disabled: true }, { name: 'Fruit loops' }]
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }]
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }]
      }
    ]
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'nz-demo-tree-view-directory',
  imports: [
    NzIconDirective,
    NzTreeViewComponent,
    NzTreeNodeNoopToggleDirective,
    NzTreeNodeComponent,
    NzTreeNodeOptionComponent,
    NzTreeNodeDefDirective,
    NzTreeNodePaddingDirective,
    NzTreeNodeToggleRotateIconDirective,
    NzTreeNodeToggleDirective,
    NzTreeNodeNoopToggleDirective,
    NzTreeNodeOptionComponent,
    NzTreeNodeComponent,
    NzTreeViewComponent,
    NzTreeNodeDefDirective,
    NzTreeNodePaddingDirective,
    NzTreeNodeToggleRotateIconDirective
  ],
  standalone: true,
  template: `
    <nz-tree-view [nzTreeControl]="treeControl" [nzDataSource]="dataSource" [nzDirectoryTree]="true">
      <nz-tree-node *nzTreeNodeDef="let node" nzTreeNodePadding>
        <nz-tree-node-toggle nzTreeNodeNoopToggle></nz-tree-node-toggle>
        <nz-tree-node-option
          [nzDisabled]="node.disabled"
          [nzSelected]="selectListSelection.isSelected(node)"
          (nzClick)="selectListSelection.toggle(node)"
        >
          <span nz-icon nzType="file" nzTheme="outline"></span>
          {{ node.name }}
        </nz-tree-node-option>
      </nz-tree-node>

      <nz-tree-node *nzTreeNodeDef="let node; when: hasChild" nzTreeNodePadding>
        <nz-tree-node-toggle>
          <span nz-icon nzType="caret-down" nzTreeNodeToggleRotateIcon></span>
        </nz-tree-node-toggle>
        <nz-tree-node-option
          [nzDisabled]="node.disabled"
          [nzSelected]="selectListSelection.isSelected(node)"
          (nzClick)="selectListSelection.toggle(node)"
        >
          <span nz-icon [nzType]="treeControl.isExpanded(node) ? 'folder-open' : 'folder'" nzTheme="outline"></span>
          {{ node.name }}
        </nz-tree-node-option>
      </nz-tree-node>
    </nz-tree-view>
  `
})
export class NzDemoTreeViewDirectoryComponent implements AfterViewInit {
  private transformer = (node: FoodNode, level: number): ExampleFlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    disabled: !!node.disabled
  });
  selectListSelection = new SelectionModel<ExampleFlatNode>();

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.setData(TREE_DATA);
  }

  hasChild = (_: number, node: ExampleFlatNode): boolean => node.expandable;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.treeControl.expand(this.getNode('Vegetables')!);
    }, 300);
  }

  getNode(name: string): ExampleFlatNode | null {
    return this.treeControl.dataNodes.find(n => n.name === name) || null;
  }
}
