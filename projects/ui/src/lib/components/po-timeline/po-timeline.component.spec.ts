import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTimelineComponent } from './po-timeline.component';
import { Component } from '@angular/core';
import { PoTimelineItem } from './interfaces/po-timeline-item.interface';
import { PoTimelineMode } from './enums/po-timeline-mode.enum';

describe('PoTimelineComponent', () => {
  let component: PoTimelineComponent;
  let fixture: ComponentFixture<PoTimelineComponent>;

  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoTimelineComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('timelineModeClass: should update to "po-timeline-full" if `timelineMode` is "full".', () => {
      component.timelineMode = PoTimelineMode.Full;
      expect(component.timelineModeClass).toEqual('po-timeline-full');
    });

    it('timelineModeClass: should update to "po-timeline-compact" if `timelineMode` is "compact".', () => {
      component.timelineMode = PoTimelineMode.Compact;
      expect(component.timelineModeClass).toEqual('po-timeline-compact');
    });

    it('timelineMode: should update property with valid values', () => {
      component.timelineMode = PoTimelineMode.Full;
      expect(component.timelineMode).toBe(PoTimelineMode.Full);

      component.timelineMode = PoTimelineMode.Compact;
      expect(component.timelineMode).toBe(PoTimelineMode.Compact);
    });

    it('timelineMode: should update property to default value when passed invalid value', () => {
      component.timelineMode = null;
      expect(component.timelineMode).toBe(PoTimelineMode.Full);

      component.timelineMode = undefined;
      expect(component.timelineMode).toBe(PoTimelineMode.Full);
    });

    it('clickable: should update property with valid values', () => {
      component.clickable = false;
      expect(component.clickable).toBe(false);

      component.clickable = true;
      expect(component.clickable).toBe(true);
    });
  });

  describe('Methods:', () => {
    const item: PoTimelineItem = {
      title: 'Test title',
      color: 'test color',
      description: 'test description',
      icon: 'test icon'
    };

    it('Should call `itemSelected` with `clickable` equal false and not emit event', () => {
      component.clickable = false;

      spyOn(component.onClickItem, 'emit');

      component.itemSelected(item);
      expect(component.onClickItem.emit).toHaveBeenCalledTimes(0);
    });

    it('Should call `itemSelected` with `item` and return the same', () => {
      component.clickable = true;

      spyOn(component.onClickItem, 'emit');

      component.itemSelected(item);
      expect(component.onClickItem.emit).toHaveBeenCalledWith(item);
    });

    it('Should return `item` when click in panel', () => {
      component.clickable = true;
      component.items = [item];
      fixture.detectChanges();

      spyOn(component.onClickItem, 'emit');

      const panel = nativeElement.querySelector('.po-timeline-panel');

      panel.click();

      expect(component.onClickItem.emit).toBeTruthy();
    });
  });

  describe('Templates:', () => {
    const items: Array<PoTimelineItem> = [
      {
        title: 'Mock',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
        icon: 'po-icon po-icon-book',
        color: 'po-color-primary'
      },
      {
        title: 'Mock 2',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
        icon: 'po-icon po-icon-book',
        color: 'po-color-primary'
      }
    ];

    it('Should contain `po-timeline-right` if timeline has more than one item', () => {
      component.items = items;
      fixture.detectChanges();
      const item = nativeElement.querySelector('.po-timeline-right');

      expect(item).toBeTruthy();
    });

    it('Should contain `po-timeline-left` if timeline has any item', () => {
      component.items = items;
      fixture.detectChanges();
      const item = nativeElement.querySelector('.po-timeline-left');

      expect(item).toBeTruthy();
    });

    it('Should contain `po-timeline-full` if `p-mode` equals full', () => {
      component.timelineMode = PoTimelineMode.Full;
      fixture.detectChanges();
      const fullTimeline = nativeElement.querySelector('.po-timeline-full');
      expect(fullTimeline).toBeTruthy();
    });

    it('Should contain `po-timeline-compact` if `p-mode` equals compact', () => {
      component.timelineMode = PoTimelineMode.Compact;
      fixture.detectChanges();
      const compactTimeline = nativeElement.querySelector('.po-timeline-compact');
      expect(compactTimeline).toBeTruthy();
    });
  });
});
