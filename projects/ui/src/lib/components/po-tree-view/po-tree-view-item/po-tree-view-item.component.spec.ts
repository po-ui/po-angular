import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PoFieldModule } from '../../po-field/po-field.module';

import { PoTreeViewItemComponent } from './po-tree-view-item.component';
import { PoTreeViewItemHeaderComponent } from '../po-tree-view-item-header/po-tree-view-item-header.component';
import { PoTreeViewService } from '../services/po-tree-view.service';

describe('PoTreeviewItemComponent:', () => {
  let component: PoTreeViewItemComponent;
  let fixture: ComponentFixture<PoTreeViewItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, PoFieldModule],
      declarations: [PoTreeViewItemComponent, PoTreeViewItemHeaderComponent],
      providers: [PoTreeViewService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTreeViewItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewItemComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('hasSubItems: should return true if has subItems', () => {
      component.item = {
        label: 'Nivel 0',
        value: '220',
        subItems: [{ label: 'Nivel 01', value: 11 }]
      };

      expect(component.hasSubItems).toBe(true);
    });

    it('hasSubItems: should return false if subItems is undefined', () => {
      component.item = {
        label: 'Nivel 0',
        value: '220',
        subItems: undefined
      };

      expect(component.hasSubItems).toBe(false);
    });
  });

  describe('Methods:', () => {
    it('onClick: should call event.preventDefault, event.stopPropagation and treeViewService.emitExpandedEvent with item', () => {
      component.item = { label: 'Label 01', value: 12 };

      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      const spyPreventDefault = spyOn(fakeEvent, 'preventDefault');
      const spyStopPropagation = spyOn(fakeEvent, 'stopPropagation');
      const spyEmitEvent = spyOn(component['treeViewService'], 'emitExpandedEvent');

      component.onClick(<any>fakeEvent);

      expect(component.item.expanded).toBe(true);
      expect(spyPreventDefault).toHaveBeenCalled();
      expect(spyStopPropagation).toHaveBeenCalled();
      expect(spyEmitEvent).toHaveBeenCalledWith(component.item);
    });

    it('onSelect: should call treeViewService.emitSelectedEvent with item', () => {
      component.item = { label: 'Label 01', value: 12 };

      const spyEmitEvent = spyOn(component['treeViewService'], 'emitSelectedEvent');

      component.onSelect(component.item);

      expect(spyEmitEvent).toHaveBeenCalledWith(component.item);
    });
  });

  describe('Templates:', () => {
    it('should find .po-tree-view-item-group if has subItems', () => {
      component.item = {
        label: 'Nivel 01',
        subItems: [{ label: 'Nivel 02', value: 12 }],
        value: '110'
      };

      fixture.detectChanges();

      const treeViewItemGroup = fixture.debugElement.nativeElement.querySelector('.po-tree-view-item-group');
      expect(treeViewItemGroup).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-group if hasn`t subItems', () => {
      component.item = {
        label: 'Nivel 01',
        value: '1',
        subItems: undefined
      };

      fixture.detectChanges();

      const treeViewItemGroup = fixture.debugElement.nativeElement.querySelector('.po-tree-view-item-group');
      expect(treeViewItemGroup).toBe(null);
    });

    it('trackByFunction: should return index param', () => {
      expect(component.trackByFunction(1)).toBe(1);
    });

    it('animateEnter: should animate height/opacity and call animationComplete on finish', () => {
      const animationComplete = jasmine.createSpy('animationComplete');
      const animation: any = {};
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 150 });
      spyOn(element, 'animate').and.returnValue(animation);

      component.animateEnter(<any>{ target: element, animationComplete });

      expect(element.animate).toHaveBeenCalledWith(
        [
          { height: '0px', opacity: 0, offset: 0 },
          { height: '150px', opacity: 0, offset: 0.6667 },
          { height: '150px', opacity: 1, offset: 1 }
        ],
        { duration: 300, easing: 'linear' }
      );

      animation.onfinish();
      expect(animationComplete).toHaveBeenCalled();
    });

    it('animateLeave: should animate height/opacity and call animationComplete on finish', () => {
      const animationComplete = jasmine.createSpy('animationComplete');
      const animation: any = {};
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 90 });
      spyOn(element, 'animate').and.returnValue(animation);

      component.animateLeave(<any>{ target: element, animationComplete });

      expect(element.animate).toHaveBeenCalledWith(
        [
          { height: '90px', opacity: 1, offset: 0 },
          { height: '0px', opacity: 1, offset: 0.6667 },
          { height: '0px', opacity: 0, offset: 1 }
        ],
        { duration: 300, easing: 'linear' }
      );

      animation.onfinish();
      expect(animationComplete).toHaveBeenCalled();
    });
  });
});
