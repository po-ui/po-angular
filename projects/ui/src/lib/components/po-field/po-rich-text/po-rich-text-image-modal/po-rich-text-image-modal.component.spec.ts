import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoUtils as UtilsFunction } from '../../../../utils/util';

import { PoFieldModule } from '../../po-field.module';
import { PoButtonGroupModule } from '../../../po-button-group';
import { PoModalModule } from '../../../po-modal/po-modal.module';
import { PoRichTextImageModalComponent } from './po-rich-text-image-modal.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PoRichTextImageModalComponent', () => {
  let component: PoRichTextImageModalComponent;
  let fixture: ComponentFixture<PoRichTextImageModalComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [PoButtonGroupModule, PoModalModule, PoFieldModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoRichTextImageModalComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it(`isUploadValid: should return true if uploadModel is not empty`, () => {
      component.uploadModel = ['fileMock'];

      expect(component['isUploadValid']).toBeTruthy();
    });

    it(`isUploadValid: should return false if uploadModel is undefined`, () => {
      component.uploadModel = undefined;

      expect(component['isUploadValid']).toBeFalsy();
    });

    it(`isUploadValid: should return false if uploadModel is an empty array`, () => {
      component.uploadModel = [];

      expect(component['isUploadValid']).toBeFalsy();
    });

    it(`isUrlValid: should return true if url is valid`, () => {
      component.modalImageForm = <any>{
        valid: true
      };
      component.urlImage = 'http://test.com';

      expect(component['isUrlValid']).toBeTruthy();
    });

    it(`isUrlValid: should return false if url is empty`, () => {
      component.modalImageForm = <any>{
        valid: false
      };
      component.urlImage = '';

      expect(component['isUrlValid']).toBeFalsy();
    });

    it(`isUrlValid: should return false if url is invalid`, () => {
      component.modalImageForm = <any>{
        invalid: false
      };
      component.urlImage = 'test';

      expect(component['isUrlValid']).toBeFalsy();
    });

    it('modalCancelAction: should call modal.close and cleanUpFields', () => {
      vi.spyOn(component.modal as any, 'close');
      vi.spyOn(component.command as any, 'emit');
      vi.spyOn(component as any, 'retrieveCursorPosition');
      vi.spyOn(component as any, 'cleanUpFields');

      component.modalCancelAction.action();

      expect(component.modal.close).toHaveBeenCalled();
      expect(component.command.emit).toHaveBeenCalled();
      expect(component['retrieveCursorPosition']).toHaveBeenCalled();
      expect(component['cleanUpFields']).toHaveBeenCalled();
    });

    it('modalConfirmAction: should call insertElementRef', () => {
      vi.spyOn(component as any, 'insertElementRef');

      component.modalConfirmAction.action();

      expect(component['insertElementRef']).toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {
    it(`openModal: should call 'modal.open' and 'saveCursorPosition'`, () => {
      vi.spyOn(component.modal as any, 'open');
      vi.spyOn(component as any, 'saveCursorPosition');

      component.openModal();

      expect(component.modal.open).toHaveBeenCalled();
      expect(component['saveCursorPosition']).toHaveBeenCalled();
    });

    it(`convertToBase64: should call 'convertImageToBase64'.`, async () => {
      component.uploadModel = <any>[{ rawFile: 'new file' }];
      vi.spyOn(UtilsFunction as any, 'convertImageToBase64');

      await component['convertToBase64']();

      expect(UtilsFunction.convertImageToBase64).toHaveBeenCalled();
    });

    it(`convertToBase64: shouldn't call 'convertImageToBase64'.`, async () => {
      vi.spyOn(UtilsFunction as any, 'convertImageToBase64');

      await component['convertToBase64']();

      expect(UtilsFunction.convertImageToBase64).not.toHaveBeenCalled();
    });

    it(`emitCommand: should call 'command' and 'emit'.`, () => {
      const value = 'fakeUrl';
      const command = 'insertImage';

      vi.spyOn(component.command as any, 'emit');

      component['emitCommand'](value);

      expect(component.command.emit).toHaveBeenCalledWith({ command, value });
    });

    it(`emitCommand: shouldn't call 'command' and 'emit'.`, () => {
      const value = undefined;

      vi.spyOn(component.command as any, 'emit');

      component['emitCommand'](value);

      expect(component.command.emit).not.toHaveBeenCalled();
    });

    it(`insertElementRef: should call 'retrieveCursorPosition' and 'modal.close' before 'emitCommand'`, async () => {
      vi.spyOn(component.modal as any, 'close');
      vi.spyOn(component as any, 'retrieveCursorPosition');
      const spyEmitCommand = vi.spyOn(component as any, 'emitCommand');
      vi.spyOn(component as any, 'isUrlValid').mockReturnValue(true);

      await component['insertElementRef']();

      expect(Math.min(...vi.mocked(component['retrieveCursorPosition']).mock.invocationCallOrder)).toBeLessThan(
        Math.min(...vi.mocked(spyEmitCommand).mock.invocationCallOrder)
      );
      expect(Math.min(...vi.mocked(component.modal.close).mock.invocationCallOrder)).toBeLessThan(
        Math.min(...vi.mocked(spyEmitCommand).mock.invocationCallOrder)
      );
    });

    it(`insertElementRef: should call 'convertToBase64' if 'urlImage' is undefined.`, async () => {
      component.urlImage = undefined;

      vi.spyOn(component as any, 'convertToBase64');
      vi.spyOn(component.modal as any, 'close');
      vi.spyOn(component as any, 'retrieveCursorPosition');

      await component['insertElementRef']();

      expect(component['convertToBase64']).toHaveBeenCalled();
      expect(component['retrieveCursorPosition']).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });

    it(`insertElementRef: shouldn't call 'convertToBase64' if 'urlImage' is defined.`, async () => {
      const fakeUrlImage = 'test';
      component.urlImage = fakeUrlImage;

      vi.spyOn(component as any, 'convertToBase64');
      vi.spyOn(component.modal as any, 'close');
      vi.spyOn(component as any, 'retrieveCursorPosition');
      vi.spyOn(component as any, 'cleanUpFields');

      await component['insertElementRef']();

      expect(component['convertToBase64']).not.toHaveBeenCalled();
      expect(component['retrieveCursorPosition']).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
      expect(component['cleanUpFields']).toHaveBeenCalled();
    });

    it(`insertElementRef: should call 'emitCommand' with 'urlImage' if 'isUrlValid' returns 'true'.`, async () => {
      vi.spyOn(component as any, 'retrieveCursorPosition');
      const fakeUrlImage = 'test';
      component.urlImage = fakeUrlImage;

      vi.spyOn(component as any, 'emitCommand');
      vi.spyOn(component as any, 'isUrlValid').mockReturnValue(true);

      await component['insertElementRef']();

      expect(component['emitCommand']).toHaveBeenCalledWith(fakeUrlImage);
    });

    it(`insertElementRef: should call 'emitCommand' with 'base64Image' if 'isUploadValid' returns 'true'.`, async () => {
      const fakeBase64Image = 'imageBase64';

      vi.spyOn(component as any, 'emitCommand');
      vi.spyOn(component as any, 'retrieveCursorPosition');
      vi.spyOn(component as any, 'convertToBase64').mockReturnValue(Promise.resolve(fakeBase64Image));
      vi.spyOn(component as any, 'isUploadValid').mockReturnValue(true);

      await component['insertElementRef']();

      expect(component['emitCommand']).toHaveBeenCalledWith(fakeBase64Image);
    });

    it(`insertElementRef: shouldn't call 'emitCommand' if 'isUploadValid' and 'isUrlValid' returns 'false'.`, async () => {
      vi.spyOn(component as any, 'retrieveCursorPosition');

      vi.spyOn(component as any, 'emitCommand');
      vi.spyOn(component as any, 'isUrlValid').mockReturnValue(false);
      vi.spyOn(component as any, 'isUploadValid').mockReturnValue(false);

      await component['insertElementRef']();

      expect(component['emitCommand']).not.toHaveBeenCalled();
    });

    it(`cleanUpFields: should set values to 'urlImage' and 'uploadModel'.`, () => {
      component.upload = <any>{};

      component['cleanUpFields']();

      expect(component.urlImage).toBe(undefined);
      expect(component.uploadModel).toBe(undefined);
    });

    it(`retrieveCursorPosition: should call 'selection.collapse'.`, () => {
      component.savedCursorPosition = [null, 1];

      vi.spyOn(component.selection as any, 'collapse');

      component['retrieveCursorPosition']();

      expect(component.selection.collapse).toHaveBeenCalled();
    });

    it(`saveCursorPosition: should set value to 'savedCursorPosition'.`, () => {
      const fakeSelection = document.getSelection();
      const expectedValueSaved = [fakeSelection.focusNode, fakeSelection.focusOffset];

      component['saveCursorPosition']();

      expect(component.savedCursorPosition).toEqual(expectedValueSaved);
    });
  });

  describe('Templates:', () => {
    it(`should contain 'po-upload-drag-drop' if 'modal.isHidden' is 'false'`, () => {
      component.modal.isHidden = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('po-upload-drag-drop')).toBeTruthy();
    });

    it(`shouldn't contain 'po-upload-drag-drop' if 'modal.isHidden' is 'true'`, () => {
      component.modal.isHidden = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('po-upload-drag-drop')).toBeFalsy();
    });
  });
});
