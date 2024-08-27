//TODO - use Tree component in UI
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component } from '@angular/core';

import {
  NzTreeFlatDataSource,
  NzTreeFlattener,
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
    children: [{ name: 'Apple' }, { name: 'Banana', disabled: false }, { name: 'Fruit loops' }]
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
  selector: 'tree-data',
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
  templateUrl: "tree.component.html"
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
      (node: { level: number; }) => node.level,
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
