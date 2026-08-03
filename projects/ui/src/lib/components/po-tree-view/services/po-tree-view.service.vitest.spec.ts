import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoTreeViewItem } from '../po-tree-view-item/po-tree-view-item.interface';
import { PoTreeViewService } from './po-tree-view.service';

describe('PoTreeViewService:', () => {
  let treeViewService: PoTreeViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoTreeViewService]
    });

    treeViewService = TestBed.inject(PoTreeViewService);
  });

  it('emitExpandedEvent: should call expandedEvent.next with treeViewItem', () => {
    const treeViewItem: PoTreeViewItem = { label: 'Nível 01', value: 1 };

    const spy = vi.spyOn(treeViewService['expandedEvent'], 'next');

    treeViewService.emitExpandedEvent(treeViewItem);

    expect(spy).toHaveBeenCalledWith(treeViewItem);
  });

  it('onExpand: should return an instanceof Observable', () => {
    const onExpand = treeViewService.onExpand();

    expect(onExpand instanceof Observable).toBe(true);
  });

  it('emitSelectedEvent: should call selectedEvent.next with treeViewItem', () => {
    const treeViewItem: PoTreeViewItem = { label: 'Nível 01', value: 1 };

    const spy = vi.spyOn(treeViewService['selectedEvent'], 'next');

    treeViewService.emitSelectedEvent(treeViewItem);

    expect(spy).toHaveBeenCalledWith(treeViewItem);
  });

  it('onSelect: should return an instanceof Observable', () => {
    const onSelect = treeViewService.onSelect();

    expect(onSelect instanceof Observable).toBe(true);
  });
});
