import { Component, ViewChild } from '@angular/core';
import { PoMenuItem } from 'projects/ui/src/lib';

@Component({
  selector: 'app-dthfui-11105',
  templateUrl: './dthfui-11105.component.html',
  standalone: false
})
export class Dthfui11105Component {
  readonly menus: Array<PoMenuItem> = [
    { label: 'Index', link: '/' },
    { label: 'PoTable', link: '/PoTable' },
    { label: 'PoTableLabs', link: '/PoTableLabs' },
    { label: 'Column Alignment', link: '/ColumnAlignment' },
    { label: 'Frozen Columns', link: '/FrozenColumns' },
    { label: 'Selection', link: '/Selection' },
    { label: 'Sort', link: '/Sort' },
    { label: 'Drag & Drop', link: '/DragDrop' },
    { label: 'Infinite Scroll', link: '/InfiniteScroll' },
    { label: 'Striped', link: '/Striped' },
    { label: 'Height & Spacing', link: '/HeightSpacing' },
    { label: 'Column Manager', link: '/ColumnManager' },
    { label: 'Loading & Empty', link: '/LoadingEmpty' },
    { label: 'Resize', link: '/Resize' },
    { label: 'Performance', link: '/Performance' },
    { label: 'PoDynamic', link: '/PoDynamic' },
    { label: 'PoLookup', link: '/PoLookup' },
    { label: 'PoSample', link: '/PoSample' }
  ];
}
