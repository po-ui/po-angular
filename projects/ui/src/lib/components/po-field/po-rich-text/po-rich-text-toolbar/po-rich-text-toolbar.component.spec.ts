import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../../util-test/util-expect.spec';

import { PoButtonGroupModule } from '../../../po-button-group';
import { PoRichTextToolbarComponent } from './po-rich-text-toolbar.component';

describe('PoRichTextToolbarComponent:', () => {
  let component: PoRichTextToolbarComponent;
  let fixture: ComponentFixture<PoRichTextToolbarComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ PoButtonGroupModule ],
      declarations: [
        PoRichTextToolbarComponent,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRichTextToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('readonly: should call toggleDisableButtons', () => {
      spyOn(component, <any>'toggleDisableButtons');

      component.readonly = true;

      expect(component['toggleDisableButtons']).toHaveBeenCalledWith(true);
    });
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call removeButtonFocus', () => {
      spyOn(component, <any>'removeButtonFocus');

      component.ngAfterViewInit();

      expect(component['removeButtonFocus']).toHaveBeenCalled();
    });

    describe('setButtonsStates:', () => {
      const commandStates = [ 'bold', 'italic', 'justifycenter' ];

      it('should map alignButtons and apply `selected` true only for `justifycenter` option', () => {
        component.setButtonsStates(commandStates);

        expect(component.alignButtons[0].selected).toBeFalsy();
        expect(component.alignButtons[1].selected).toBeTruthy();
        expect(component.alignButtons[2].selected).toBeFalsy();
        expect(component.alignButtons[3].selected).toBeFalsy();
      });

      it('should map formatButtons and apply `selected` true only for `bold` and `italic` options', () => {
        component.setButtonsStates(commandStates);

        expect(component.formatButtons[0].selected).toBeTruthy();
        expect(component.formatButtons[1].selected).toBeTruthy();
        expect(component.formatButtons[2].selected).toBeFalsy();
      });

      it('should map listButtons and doesn`t apply `selected` true', () => {
        component.setButtonsStates(commandStates);

        expect(component.listButtons[0].selected).toBeFalsy();
      });

      it('shouldn`t map neither set a `selected` value at alignButtons, formatButtons and listButtons arrays list if it`s readonly', () => {
        component.readonly = true;
        component.alignButtons[0].selected = undefined;

        component.setButtonsStates(commandStates);

        component.alignButtons.forEach(alignButton => {
          expect(alignButton.selected).toBeFalsy();
        });
        component.formatButtons.forEach(formatButton => {
          expect(formatButton.selected).toBeFalsy();
        });
      });
    });

    it('emitAlignCommand: should emit command', () => {
      spyOn(component.command, 'emit');

      component['emitAlignCommand']('justifyleft');

      expect(component.command.emit).toHaveBeenCalledWith('justifyleft');
    });

    it('emitAlignCommand: should apply false to alignButtons[index].selected if it`s set with true', () => {
      component.alignButtons[0].selected = true;

      component['emitAlignCommand']('justifyleft');

      expect(component.alignButtons[0].selected).toBeFalsy();
    });

    it('emitAlignCommand: shouldn`t apply false to alignButtons[index].selected if it`s already false', () => {
      component.alignButtons[0].selected = false;

      component['emitAlignCommand']('justifyleft');

      expect(component.alignButtons[0].selected).toBeFalsy();
    });

    it('emitCommand: should emit command', () => {
      spyOn(component.command, 'emit');

      component['emitCommand']('justifyleft');

      expect(component.command.emit).toHaveBeenCalledWith('justifyleft');
    });

    it('removeButtonFocus: should apply attribute tabindex -1 for all buttons.', () => {
      component['removeButtonFocus']();
      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('button');

      buttons.forEach(button => {
        expect(button.getAttribute('tabindex')).toEqual('-1');
      });
    });

    it('toggleDisableButtons: should apply the state to alignButtons, formatButtons and lisButtons `disabled` attributes', () => {
      component['toggleDisableButtons'](true);

      component.alignButtons.forEach(alignButton => {
        expect(alignButton.disabled).toBeTruthy();
      });
      component.formatButtons.forEach(formatButton => {
        expect(formatButton.disabled).toBeTruthy();
      });
      expect(component.listButtons[0].disabled).toBeTruthy();
    });
  });
});
