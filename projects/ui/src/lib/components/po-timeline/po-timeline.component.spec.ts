import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTimelineComponent } from './po-timeline.component';
import { Component } from '@angular/core';
import { TimeLineCard } from './models/timeline-card.model';

@Component({
  template: `
  <po-timeline [p-cards]='cards' [p-size]='size' [p-clickable]='true'>
  </po-timeline>
  `
})
class PoTimeLineMockComponent {

  cards: Array<TimeLineCard> = [
    {
      title: 'Mock',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
      side: 'right',
      icon: 'po-icon po-icon-book',
      color: 'po-color-primary'
    },
    {
      title: 'Mock 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
      side: 'left',
      icon: 'po-icon po-icon-book',
      color: 'po-color-primary'
    }];

  size: string = '';
}

describe('PoTimelineComponent', () => {

  let component: PoTimelineComponent;
  let fixture: ComponentFixture<PoTimelineComponent>;
  let fixtureMock: ComponentFixture<PoTimeLineMockComponent>;

  let nativeElement: any;
  let nativeElementMock: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoTimelineComponent, PoTimeLineMockComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;

    fixtureMock = TestBed.createComponent(PoTimeLineMockComponent);
    fixtureMock.detectChanges();
    nativeElementMock = fixtureMock.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {

    const card: TimeLineCard = {
      title: 'Test title',
      color: 'test color',
      description: 'test description',
      icon: 'test icon',
      side: 'test side'
    };

    it('Should call `cardSelect` with `card` and return the same', () => {
      component.clickable = true;

      spyOn(component.onClickCard, 'emit');

      component.cardSelect(card);
      expect(component.onClickCard.emit).toHaveBeenCalledWith(card);
    });

    it('Should call `cardSelect` with `card` and not emit nothing', () => {
      component.clickable = false;

      spyOn(component.onClickCard, 'emit');
      component.cardSelect(card);

      expect(component.onClickCard.emit).toHaveBeenCalledTimes(0);
    });

    it('Should return `card` when click in panel', () => {
      component.clickable = true;
      component.cards = [card];
      fixture.detectChanges();

      spyOn(component.onClickCard, 'emit');

      const panel = nativeElement.querySelector('.timeline-panel');

      panel.click();

      expect(component.onClickCard.emit).toBeTruthy();
    });
  });

  describe('Templates:', () => {
    it('Should contain `right` if any item `card` side is right', () => {
      const rightCard = nativeElementMock.querySelector('.right');

      expect(rightCard).toBeTruthy();
    });

    it('Should contain `left` if any item `card` side is left', () => {
      const leftCard = nativeElementMock.querySelector('.left');

      expect(leftCard).toBeTruthy();
    });

    it('Should contain `lg` if `p-size` equals lg', () => {
      component.timelineSize = 'lg';
      fixture.detectChanges();
      const largeTimeLine = nativeElement.querySelector('.lg');

      expect(largeTimeLine).toBeTruthy();
    });

    it('Should contain `md` if `p-size` equals md', () => {
      component.timelineSize = 'md';
      fixture.detectChanges();
      const mediumTimeLine = nativeElement.querySelector('.md');

      expect(mediumTimeLine).toBeTruthy();
    });

    it('Should contain `sm` if `p-size` equals sm', () => {
      component.timelineSize = 'sm';
      fixture.detectChanges();
      const smallTimeLine = nativeElement.querySelector('.sm');

      expect(smallTimeLine).toBeTruthy();
    });
  });

});
