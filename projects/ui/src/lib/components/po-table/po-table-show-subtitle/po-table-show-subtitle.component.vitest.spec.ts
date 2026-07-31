import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { PoColorPaletteService } from './../../../services/po-color-palette/po-color-palette.service';

import { PoTableShowSubtitleComponent } from './po-table-show-subtitle.component';
import { PoTableSubtitleCircleComponent } from '../po-table-subtitle-circle/po-table-subtitle-circle.component';
import { PoModalModule } from '../../po-modal/po-modal.module';

describe('PoTableShowSubtitleComponent:', () => {
  let component: PoTableShowSubtitleComponent;
  let fixture: ComponentFixture<PoTableShowSubtitleComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoModalModule],
      declarations: [PoTableShowSubtitleComponent, PoTableSubtitleCircleComponent],
      providers: [PoColorPaletteService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTableShowSubtitleComponent);
    component = fixture.componentInstance;

    component.literals = {
      seeCompleteSubtitle: 'see complete subtitle'
    };

    component.subtitles = [
      { value: 'success', label: 'Label', color: 'color-11', content: 'Success Content' },
      { value: 'warning', label: 'Label', color: 'color-08', content: 'Warning Content' },
      { value: 'danger', label: 'Label', color: 'color-07', content: 'Danger Content' }
    ];

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoTableShowSubtitleComponent).toBe(true);
  });

  describe('Templates:', () => {
    it('should create subtitles inside modal if `po-table-footer-show-subtitle` is clicked', () => {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', false, true);

      const subtitleFooter = nativeElement.querySelector('.po-table-footer-show-subtitle');
      subtitleFooter.dispatchEvent(event);
      subtitleFooter.click();

      fixture.detectChanges();

      const modal = nativeElement.querySelectorAll('.po-table-subtitle-footer-modal');

      expect(modal.length).toBe(component.subtitles.length);
    });
  });
});
