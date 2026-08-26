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

    const spyEmitExpandedEvent = spyOn(treeViewService['expandedEvent'], 'next');

    treeViewService.emitExpandedEvent(treeViewItem);

    expect(spyEmitExpandedEvent).toHaveBeenCalledWith(treeViewItem);
  });

  it('onExpand: should return an instanceof Observable', () => {
    expect(treeViewService.onExpand() instanceof Observable).toBeTruthy();
  });

  it('emitSelectedEvent: should call selectedEvent.next with treeViewItem', () => {
    const treeViewItem: PoTreeViewItem = { label: 'Nível 01', value: 1 };

    const spyEmitSelectedEvent = spyOn(treeViewService['selectedEvent'], 'next');

    treeViewService.emitSelectedEvent(treeViewItem);

    expect(spyEmitSelectedEvent).toHaveBeenCalledWith(treeViewItem);
  });

  it('onSelect: should return an instanceof Observable', () => {
    expect(treeViewService.onSelect() instanceof Observable).toBeTruthy();
  });

  it('emitActivatedEvent: should call activatedEvent.next with treeViewItem', () => {
    const treeViewItem: PoTreeViewItem = { label: 'Nível 01', value: 1 };

    const spyEmitActivatedEvent = spyOn(treeViewService['activatedEvent'], 'next');

    treeViewService.emitActivatedEvent(treeViewItem);

    expect(spyEmitActivatedEvent).toHaveBeenCalledWith(treeViewItem);
  });

  it('onActivate: should return an instanceof Observable', () => {
    expect(treeViewService.onActivate() instanceof Observable).toBeTruthy();
  });
});
