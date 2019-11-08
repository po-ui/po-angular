import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoTreeViewItem } from '../po-tree-view-item/po-tree-view-item.interface';
import { PoTreeViewService } from './po-tree-view.service';

describe('PoTreeViewService:', () => {
  let treeViewService: PoTreeViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PoTreeViewService ]
    });

    treeViewService = TestBed.get(PoTreeViewService);
  });

  it('emitEvent: should call event.next with treeViewItem', () => {
    const treeViewItem: PoTreeViewItem = {
      label: 'Nível 01',
      value: 1
    };

    const spyEmitEvent = spyOn(treeViewService['event'], 'next');

    treeViewService.emitEvent(treeViewItem);

    expect(spyEmitEvent).toHaveBeenCalledWith(treeViewItem);
  });

  it('receiveEvent: should return an instanceof Observable receiveEvent', () => {
    const receiveEvent = treeViewService.receiveEvent();

    expect(receiveEvent instanceof Observable).toBeTruthy();
  });

});
