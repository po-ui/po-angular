import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTimelineComponent } from './po-timeline.component';
import { Component } from '@angular/core';
import { PoTimelineItem } from './interfaces/po-timeline-item.interface';

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

  describe('Methods:', () => {
    let item: PoTimelineItem = {
      title: 'Test title',
      color: 'test color',
      description: 'test description',
      icon: 'test icon'
    };

    it('Should call `itemSelected` with `item` and return the same', () => {
      component.clickable = true;

      spyOn(component.onClickCard, 'emit');

      component.itemSelected(item);
      expect(component.onClickCard.emit).toHaveBeenCalledWith(item);
    });

    it('Should call `itemSelected` with `item` and return undefined', () => {
      component.clickable = false;

      expect(component.itemSelected(item)).toEqual(undefined);
    });

    it('Should return `item` when click in panel', () => {
      component.clickable = true;
      component.items = [item];
      fixture.detectChanges();

      spyOn(component.onClickCard, 'emit');

      const panel = nativeElement.querySelector('.po-timeline-panel');

      panel.click();

      expect(component.onClickCard.emit).toBeTruthy();
    });
  });

  describe('Templates:', () => {
    const items: PoTimelineItem[] = [
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
      component.timelineMode = 'full';
      fixture.detectChanges();
      const fullTimeline = nativeElement.querySelector('.po-timeline-full');
      expect(fullTimeline).toBeTruthy();
    });

    it('Should contain `po-timeline-compact` if `p-mode` equals compact', () => {
      component.timelineMode = 'compact';
      fixture.detectChanges();
      const compactTimeline = nativeElement.querySelector('.po-timeline-compact');
      expect(compactTimeline).toBeTruthy();
    });
  });
});
