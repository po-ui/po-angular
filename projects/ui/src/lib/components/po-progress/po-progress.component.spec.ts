import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoProgressStatus } from './enums/po-progress-status.enum';
import { PoProgressComponent } from './po-progress.component';
import { PoProgressModule } from './po-progress.module';

describe('PoProgressComponent:', () => {
  let component: PoProgressComponent;
  let fixture: ComponentFixture<PoProgressComponent>;

  let nativeElement: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoProgressModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoProgressComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoProgressComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it(`emitCancellation: should call 'emit' with 'status'`, () => {
      component.status = PoProgressStatus.Success;

      vi.spyOn(component.cancel as any, 'emit');

      component.emitCancellation();

      expect(component.cancel.emit).toHaveBeenCalledWith(component.status);
    });

    it(`emitRetry: should call 'emit'`, () => {
      component.status = PoProgressStatus.Success;

      vi.spyOn(component.retry as any, 'emit');

      component.emitRetry();

      expect(component.retry.emit).toHaveBeenCalled();
    });

    it('callAction: should emit customActionClick event', () => {
      vi.spyOn(component.customActionClick as any, 'emit');

      component.callAction();

      expect(component.customActionClick.emit).toHaveBeenCalled();
    });

    it('isActionVisible: should return true if visible is true or a function that returns true', () => {
      component.customAction = { label: 'Action', visible: true };
      expect(component.isActionVisible(component.customAction)).toBe(true);

      component.customAction = { label: 'Action', visible: () => true };
      expect(component.isActionVisible(component.customAction)).toBe(true);
    });

    it('isActionVisible: should return false if visible is false or a function that returns false', () => {
      component.customAction = { label: 'Action', visible: false };
      expect(component.isActionVisible(component.customAction)).toBe(false);

      component.customAction = { label: 'Action', visible: () => false };
      expect(component.isActionVisible(component.customAction)).toBe(false);
    });

    it('isActionVisible: should return true if action.icon is defined and action.visible is true', () => {
      component.customAction = { icon: 'an an-icon', visible: true };
      expect(component.isActionVisible(component.customAction)).toBe(true);
    });

    it('isActionVisible: should return false if action.icon is defined but action.visible is false', () => {
      component.customAction = { icon: 'an an-icon', visible: false };
      expect(component.isActionVisible(component.customAction)).toBe(false);
    });

    it('isActionVisible: should return true if action.icon is defined and action.visible is a function that returns true', () => {
      component.customAction = { icon: 'an an-icon', visible: () => true };
      expect(component.isActionVisible(component.customAction)).toBe(true);
    });

    it('isActionVisible: should return false if action.icon is defined and action.visible is a function that returns false', () => {
      component.customAction = { icon: 'an an-icon', visible: () => false };
      expect(component.isActionVisible(component.customAction)).toBe(false);
    });

    it('actionIsDisabled: should return true if disabled is true or a function that returns true', () => {
      component.customAction = { label: 'Action', disabled: true };
      expect(component.actionIsDisabled(component.customAction)).toBe(true);

      component.customAction = { label: 'Action', disabled: () => true };
      expect(component.actionIsDisabled(component.customAction)).toBe(true);
    });

    it('actionIsDisabled: should return false if disabled is false or a function that returns false', () => {
      component.customAction = { label: 'Action', disabled: false };
      expect(component.actionIsDisabled(component.customAction)).toBe(false);

      component.customAction = { label: 'Action', disabled: () => false };
      expect(component.actionIsDisabled(component.customAction)).toBe(false);
    });
  });

  describe('Properties:', () => {
    it('statusClass: should return `po-progress-success` if `status` is `PoProgressStatus.Success`', () => {
      component.status = PoProgressStatus.Success;

      expect(component.statusClass).toBe('po-progress-success');
    });

    it('statusClass: should return `po-progress-error` if `status` is `PoProgressStatus.Error`', () => {
      component.status = PoProgressStatus.Error;

      expect(component.statusClass).toBe('po-progress-error');
    });

    it('statusClass: should return `po-progress-default` if `status` is `PoProgressStatus.Default`', () => {
      component.status = PoProgressStatus.Default;

      expect(component.statusClass).toBe('po-progress-default');
    });

    it('statusClass: should return `po-progress-default` if `status` is undefined', () => {
      component.status = undefined;

      expect(component.statusClass).toBe('po-progress-default');
    });

    it('statusClass: should return `po-progress-default` if `status` is invalid', () => {
      (component as any).status = 'test';

      expect(component.statusClass).toBe('po-progress-default');
    });

    it(`isAllowCancel: should be 'true' if 'cancel' contain 'function' and status is PoProgressStatus.Default`, () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);
      component.status = PoProgressStatus.Default;

      expect(component.isAllowCancel).toBe(true);
    });

    it(`isAllowCancel: should be 'false' if 'cancel' does not contain 'function' and status is PoProgressStatus.Success`, () => {
      component.cancel.observers.length = 0;
      component.status = PoProgressStatus.Success;

      expect(component.isAllowCancel).toBe(false);
    });

    it(`isAllowCancel: should be 'false' if 'cancel' contain 'function' and status is PoProgressStatus.Success`, () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);
      component.status = PoProgressStatus.Success;

      expect(component.isAllowCancel).toBe(false);
    });

    it(`isAllowRetry: should be 'true' if 'retry' contain 'function' and status is PoProgressStatus.Error`, () => {
      const retryFunction = () => {};
      component.retry.observers.push(<any>[new Observable(retryFunction)]);
      component.status = PoProgressStatus.Error;

      expect(component.isAllowRetry).toBe(true);
    });

    it(`isAllowRetry: should be 'false' if 'retry' does not contain 'function' and status isn't PoProgressStatus.Error`, () => {
      component.retry.observers.length = 0;
      component.status = PoProgressStatus.Default;

      expect(component.isAllowRetry).toBe(false);
    });

    it(`isAllowRetry: should be 'false' if 'retry' contain 'function' and status isn't PoProgressStatus.Error`, () => {
      const retryFunction = () => {};
      component.retry.observers.push(<any>[new Observable(retryFunction)]);
      component.status = PoProgressStatus.Default;

      expect(component.isAllowRetry).toBe(false);
    });

    describe('p-custom-action:', () => {
      it('should set customAction correctly when a valid object is assigned', () => {
        const customAction = {
          label: 'Download',
          icon: 'an an-download',
          type: 'default',
          visible: true,
          disabled: false
        };

        component.customAction = customAction;

        expect(component.customAction).toEqual(customAction);
      });

      it('should handle undefined or null values for customAction', () => {
        [undefined, null].forEach(value => {
          component.customAction = value;
          expect(component.customAction).toBe(value);
        });
      });
    });
  });

  describe('Templates:', () => {
    it('should contain the value of text property', () => {
      component.text = 'files';

      fixture.detectChanges();

      const text = nativeElement.querySelector('.po-progress-description').textContent.trim();

      expect(text).toBe(component.text);
    });

    it('should contain `an-tractor` if `p-info-icon` is `an-tractor`', () => {
      component.infoIcon = 'an-tractor';

      fixture.detectChanges();

      const infoIcon = nativeElement.querySelector('.an-tractor');

      expect(infoIcon).toBeTruthy();
    });

    it('shouldn`t find `.po-progress-info-icon` if `infoIcon` is `undefined`', () => {
      component.infoIcon = undefined;

      fixture.detectChanges();

      const infoIcon = nativeElement.querySelector('.po-progress-info-icon');

      expect(infoIcon).toBe(null);
    });

    it('should contain `p-info` value', () => {
      component.info = 'test info';

      fixture.detectChanges();

      const info = nativeElement.querySelector('.po-progress-info-text').textContent.trim();

      expect(info).toBe(component.info);
    });

    it('shouldn`t find `.po-progress-info-text` if `info` is undefined ', () => {
      component.info = undefined;

      fixture.detectChanges();

      const info = nativeElement.querySelector('.po-progress-info-text');

      expect(info).toBe(null);
    });

    it('should contain `po-progress-default` if `status` is `default`', () => {
      component.status = PoProgressStatus.Default;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-default')).toBeTruthy();
    });

    it('should contain `po-progress-error` if `status` is `error`', () => {
      component.status = PoProgressStatus.Error;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-error')).toBeTruthy();
    });

    it('should contain `po-progress-success` if `status` is `success`', () => {
      component.status = PoProgressStatus.Success;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-success')).toBeTruthy();
    });

    it('should contain `po-progress-default` if `status` does not exist', () => {
      (component as any).status = 'test';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-default')).toBeTruthy();
    });

    it('should render po-progress-bar when shape is bar', () => {
      fixture.componentRef.setInput('p-shape', 'bar');

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-progress-bar')).toBeTruthy();
      expect(nativeElement.querySelector('po-progress-circle')).toBeFalsy();
    });

    it('should render po-progress-circle when shape is circle', () => {
      fixture.componentRef.setInput('p-shape', 'circle');

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-progress-circle')).toBeTruthy();
      expect(nativeElement.querySelector('po-progress-bar')).toBeFalsy();
    });

    it('should set indicator pathLength in circle indeterminate mode', () => {
      fixture.componentRef.setInput('p-shape', 'circle');
      component.indeterminate = true;

      fixture.detectChanges();

      const circleIndicator = nativeElement.querySelector(
        '.po-progress-circle-indeterminate .po-progress-circle-indicator'
      );

      expect(circleIndicator).toBeTruthy();
      expect(circleIndicator.getAttribute('pathLength')).toBe('100');
    });

    it('should set aria-valuemin and aria-valuemax in circle indeterminate mode', () => {
      fixture.componentRef.setInput('p-shape', 'circle');
      component.indeterminate = true;

      fixture.detectChanges();

      const progressbar = nativeElement.querySelector('.po-progress-circle-indeterminate[role="progressbar"]');

      expect(progressbar).toBeTruthy();
      expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
      expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
      expect(progressbar.hasAttribute('aria-valuenow')).toBe(false);
    });

    it('should set aria-label in bar progress when p-aria-label is informed', () => {
      fixture.componentRef.setInput('p-aria-label', 'Upload progress');

      fixture.detectChanges();

      const progressbar = nativeElement.querySelector('.po-progress-bar-default[role="progressbar"]');

      expect(progressbar).toBeTruthy();
      expect(progressbar.getAttribute('aria-label')).toBe('Upload progress');
    });

    it('should use p-text as fallback aria-label in bar progress', () => {
      component.text = 'File upload';

      fixture.detectChanges();

      const progressbar = nativeElement.querySelector('.po-progress-bar-default[role="progressbar"]');

      expect(progressbar).toBeTruthy();
      expect(progressbar.getAttribute('aria-label')).toBe('File upload');
    });

    it('should set aria-label and range attributes in indeterminate bar progress', () => {
      fixture.componentRef.setInput('p-aria-label', 'Upload in progress');
      component.indeterminate = true;

      fixture.detectChanges();

      const progressbar = nativeElement.querySelector('.po-progress-bar-indeterminate-track[role="progressbar"]');

      expect(progressbar).toBeTruthy();
      expect(progressbar.getAttribute('aria-label')).toBe('Upload in progress');
      expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
      expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
      expect(progressbar.hasAttribute('aria-valuenow')).toBe(false);
    });

    it('should set aria-label in circle progress when p-aria-label is informed', () => {
      fixture.componentRef.setInput('p-status', 'success');
      fixture.componentRef.setInput('p-shape', 'circle');
      fixture.componentRef.setInput('p-aria-label', 'Sync progress');

      fixture.detectChanges();

      const progressbar = nativeElement.querySelector('po-progress-circle [role="progressbar"]');

      expect(progressbar).toBeTruthy();
      expect(progressbar.getAttribute('aria-label')).toBe('success Sync progress');
    });

    it('should apply minimum effective radius when showPercentage is true and radius is smaller than 24', () => {
      fixture.componentRef.setInput('p-shape', 'circle');
      fixture.componentRef.setInput('p-radius', 10);
      component.showPercentage = true;

      fixture.detectChanges();

      const tray = nativeElement.querySelector('.po-progress-circle-tray');

      expect(tray).toBeTruthy();
      expect(tray.getAttribute('r')).toBe('24');
    });

    it('should apply minimum effective radius when status is error and radius is smaller than 24', () => {
      fixture.componentRef.setInput('p-shape', 'circle');
      fixture.componentRef.setInput('p-radius', 10);
      component.status = PoProgressStatus.Error;

      fixture.detectChanges();

      const tray = nativeElement.querySelector('.po-progress-circle-tray');

      expect(tray).toBeTruthy();
      expect(tray.getAttribute('r')).toBe('24');
    });

    it('should keep provided radius when value is greater than or equal to 20 and center content is not rendered', () => {
      fixture.componentRef.setInput('p-shape', 'circle');
      fixture.componentRef.setInput('p-radius', 30);
      component.showPercentage = false;
      component.status = PoProgressStatus.Default;

      fixture.detectChanges();

      const tray = nativeElement.querySelector('.po-progress-circle-tray');

      expect(tray).toBeTruthy();
      expect(tray.getAttribute('r')).toBe('30');
    });

    it('should render po-progress-bar by default when shape is not set', () => {
      fixture.detectChanges();

      expect(nativeElement.querySelector('po-progress-bar')).toBeTruthy();
      expect(nativeElement.querySelector('po-progress-circle')).toBeFalsy();
    });

    it('should update property `p-shape` with valid values', () => {
      fixture.componentRef.setInput('p-shape', 'bar');
      fixture.detectChanges();
      expect(component.shape()).toBe('bar');

      fixture.componentRef.setInput('p-shape', 'circle');
      fixture.detectChanges();
      expect(component.shape()).toBe('circle');
    });

    it('should update property `p-shape` with bar if has not valid values', () => {
      fixture.componentRef.setInput('p-shape', 'square');
      fixture.detectChanges();
      expect(component.shape()).toBe('bar');

      fixture.componentRef.setInput('p-shape', 'triangle');
      fixture.detectChanges();
      expect(component.shape()).toBe('bar');
    });

    it('should not show percentage in info area when shape is circle', () => {
      fixture.componentRef.setInput('p-shape', 'circle');
      component.showPercentage = true;
      component.value = 50;

      fixture.detectChanges();

      const infoRight = nativeElement.querySelector('.po-progress-info-right');
      expect(infoRight).toBeNull();
    });

    it('should contain `po-progress-bar-indeterminate-track` if `indeterminate` is `true`', () => {
      component.indeterminate = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-bar-indeterminate-track')).toBeTruthy();
    });

    it('shouldn`t contain `po-progress-bar-indeterminate` if `indeterminate` is `false`', () => {
      component.indeterminate = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-bar-indeterminate')).toBeFalsy();
    });

    it('should contain `an-x` if `cancel` is defined', () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.an-x')).toBeTruthy();
    });

    it('shouldn`t contain `an-x` if `cancel` is undefined', () => {
      component.cancel.observers.length = 0;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.an-x')).toBeFalsy();
    });

    it('should emit cancellation with status if `cancel` is clicked', () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);

      fixture.detectChanges();

      vi.spyOn(component.cancel as any, 'emit');

      nativeElement.querySelector('.an-x').click();

      expect(component.cancel.emit).toHaveBeenCalledWith(component.status);
    });

    it('should emit retry with status if `retry` is clicked', () => {
      const retryFunction = () => {};

      component.retry.observers.push(<any>[new Observable(retryFunction)]);
      component.status = PoProgressStatus.Error;

      fixture.detectChanges();

      vi.spyOn(component.retry as any, 'emit');

      nativeElement.querySelector('.an-arrow-clockwise').click();

      expect(component.retry.emit).toHaveBeenCalled();
    });

    it('shouldn`t find `.po-progress-description` and `.po-progress-description-mobile` if `text` is undefined', () => {
      component.text = undefined;

      fixture.detectChanges();

      const descriptionMobile = nativeElement.querySelector('.po-progress-description-mobile');
      const description = nativeElement.querySelector('.po-progress-description');

      expect(descriptionMobile).toBe(null);
      expect(description).toBe(null);
    });

    it('should find `.po-progress-info` if `info` is truthy', () => {
      component.info = 'filename.jpg';

      fixture.detectChanges();

      const progressInfo = nativeElement.querySelector('.po-progress-info');

      expect(progressInfo).toBeTruthy();
    });

    it('shouldn`t find `.po-progress-info-text` if `info`, `infoIcon`, `isAllowRetry` and `isAllowCancel` are falsy', () => {
      component.info = undefined;
      component.infoIcon = undefined;
      component.retry.observers.length = 0;
      component.cancel.observers.length = 0;

      fixture.detectChanges();

      const progressInfo = nativeElement.querySelector('.po-progress-info-text');

      expect(progressInfo).toBe(null);
    });

    it('should display customAction button with correct label and icon when customAction is defined and visible', () => {
      component.customAction = {
        label: 'Download',
        icon: 'an an-download',
        visible: true
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('po-button');
      expect(customActionButton).toBeTruthy();
      expect(customActionButton.textContent.trim()).toBe('Download');
      expect(customActionButton.querySelector('.an.an-download')).toBeTruthy();
    });

    it('should display customAction button when visible is undefined', () => {
      component.customAction = {
        icon: 'an an-download'
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('po-button');
      expect(customActionButton).toBeTruthy();
    });

    it('should not display customAction button when customAction is not visible', () => {
      component.customAction = {
        label: 'Hidden Action',
        visible: false
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('po-button');
      expect(customActionButton).toBeFalsy();
    });

    it('should emit customActionClick event when customAction button is clicked', () => {
      component.customAction = { label: 'Download', icon: 'download', type: 'default', visible: true };
      vi.spyOn(component.customActionClick as any, 'emit');

      fixture.detectChanges();

      const customButton = nativeElement.querySelector('.po-progress-custom-button');
      expect(customButton).toBeTruthy();

      component.callAction();
      expect(component.customActionClick.emit).toHaveBeenCalled();
    });

    it('should disable customAction button when disabled is true', () => {
      component.customAction = {
        icon: 'download',
        label: 'Download',
        visible: true,
        disabled: true
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('.po-progress-custom-button button');
      expect(customActionButton).toBeTruthy();

      expect(customActionButton.disabled).toBe(true);
    });

    it('should not disable customAction button when disabled is false', () => {
      component.customAction = {
        label: 'Enabled Action',
        visible: true,
        disabled: false
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('.po-progress-custom-button button');
      expect(customActionButton.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Circle shape - private methods:', () => {
    describe('hasExplicitHeight:', () => {
      it('should return true for element with inline height in px', () => {
        const el = document.createElement('div');
        el.style.height = '200px';
        expect((component as any).hasExplicitHeight(el)).toBe(true);
      });

      it('should return false for element with no height set', () => {
        const el = document.createElement('div');
        expect((component as any).hasExplicitHeight(el)).toBe(false);
      });
    });

    describe('hasAllocatedHeight:', () => {
      it('should return true when parent with explicit height', () => {
        const grandparent = document.createElement('div');
        grandparent.style.display = 'flex';
        grandparent.style.flexDirection = 'column';
        grandparent.style.height = '200px';
        const parent = document.createElement('div');
        grandparent.appendChild(parent);
        document.body.appendChild(grandparent);

        expect((component as any).hasAllocatedHeight(parent)).toBe(true);

        document.body.removeChild(grandparent);
      });

      it('should return false when parent element does not exist', () => {
        const orphan = document.createElement('div');
        expect((component as any).hasAllocatedHeight(orphan)).toBe(false);
      });

      it('should return false when parent  without explicit height', () => {
        const grandparent = document.createElement('div');
        grandparent.style.display = 'flex';
        grandparent.style.flexDirection = 'column';
        const parent = document.createElement('div');
        grandparent.appendChild(parent);
        document.body.appendChild(grandparent);

        expect((component as any).hasAllocatedHeight(parent)).toBe(false);

        document.body.removeChild(grandparent);
      });
    });

    describe('measureAndSetParentSize:', () => {
      it('should set parentSize based on element dimensions', () => {
        vi.spyOn(window as any, 'getComputedStyle').mockReturnValue({
          height: '150px',
          width: '200px',
          paddingTop: '0px',
          paddingBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px'
        } as CSSStyleDeclaration);
        const el = document.createElement('div');
        el.style.width = '200px';
        el.style.height = '150px';
        el.style.padding = '0px';
        document.body.appendChild(el);

        (component as any).measureAndSetParentSize(el);

        expect(component.parentSize()).toBe(150);

        document.body.removeChild(el);
      });

      it('should subtract padding from dimensions', () => {
        vi.spyOn(window as any, 'getComputedStyle').mockReturnValue({
          height: '200px',
          width: '200px',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '10px',
          paddingRight: '10px'
        } as CSSStyleDeclaration);

        const el = document.createElement('div');
        el.style.width = '200px';
        el.style.height = '200px';
        el.style.padding = '10px';
        el.style.boxSizing = 'border-box';
        document.body.appendChild(el);

        (component as any).measureAndSetParentSize(el, 'entrei');
        const sizeWithPadding = component.parentSize();

        expect(sizeWithPadding).toBe(180);

        document.body.removeChild(el);
      });

      it('should not set parentSize when size is 0', () => {
        const el = document.createElement('div');
        el.style.width = '0px';
        el.style.height = '0px';
        document.body.appendChild(el);

        component.parentSize.set(0);
        (component as any).measureAndSetParentSize(el);

        expect(component.parentSize()).toBe(0);

        document.body.removeChild(el);
      });
    });

    describe('findConstrainedAncestor:', () => {
      it('should return element with explicit height in ancestor chain', () => {
        const root = document.createElement('div');
        root.style.height = '300px';
        const middle = document.createElement('div');
        root.appendChild(middle);
        const child = document.createElement('div');
        middle.appendChild(child);
        document.body.appendChild(root);

        const result = (component as any).findConstrainedAncestor(child);
        expect(result).toBe(root);

        document.body.removeChild(root);
      });

      it('should return start element when no ancestor has explicit height', () => {
        const root = document.createElement('div');
        const child = document.createElement('div');
        root.appendChild(child);
        document.body.appendChild(root);

        const result = (component as any).findConstrainedAncestor(child);
        expect(result).toBe(child);

        document.body.removeChild(root);
      });

      it('should stop traversal at max depth (10 levels)', () => {
        let current = document.createElement('div');
        const deepChild = current;
        for (let i = 0; i < 15; i++) {
          const parent = document.createElement('div');
          parent.appendChild(current);
          current = parent;
        }
        current.style.height = '200px';
        document.body.appendChild(current);

        const result = (component as any).findConstrainedAncestor(deepChild);
        expect(result).toBe(deepChild);

        document.body.removeChild(current);
      });
    });

    describe('ngOnInit circle detection:', () => {
      it('should set parentSize when parent has allocated height', () => {
        const grandparent = document.createElement('div');
        grandparent.style.display = 'flex';
        grandparent.style.flexDirection = 'column';
        grandparent.style.height = '200px';
        grandparent.style.width = '200px';
        const parent = document.createElement('div');
        parent.style.flex = '1';
        grandparent.appendChild(parent);
        document.body.appendChild(grandparent);
        parent.appendChild(nativeElement);

        fixture.componentRef.setInput('p-shape', 'circle');
        component.ngOnInit();

        expect(component.parentSize()).toBeGreaterThan(0);

        document.body.removeChild(grandparent);
      });

      it('should set parentSize when constrained ancestor has explicit height', () => {
        const ancestor = document.createElement('div');
        ancestor.style.height = '300px';
        ancestor.style.width = '300px';
        ancestor.appendChild(nativeElement);
        document.body.appendChild(ancestor);

        fixture.componentRef.setInput('p-shape', 'circle');
        component.ngOnInit();

        expect(component.parentSize()).toBeGreaterThan(0);

        document.body.removeChild(ancestor);
      });

      it('should keep parentSize as 0 when no height constraint exists', () => {
        const parent = document.createElement('div');
        parent.appendChild(nativeElement);
        document.body.appendChild(parent);

        fixture.componentRef.setInput('p-shape', 'circle');
        component.ngOnInit();

        expect(component.parentSize()).toBe(0);

        document.body.removeChild(parent);
      });

      it('should not execute circle logic when shape is bar', () => {
        fixture.componentRef.setInput('p-shape', 'bar');
        component.ngOnInit();

        expect(component.parentSize()).toBe(0);
      });
    });

    describe('ngAfterViewInit:', () => {
      beforeEach(() => {
        (window as any).ResizeObserver = vi.fn().mockReturnValue({
          observe: vi.fn(),
          disconnect: vi.fn()
        });
      });

      it('should not create ResizeObserver when shape is not circle', () => {
        fixture.componentRef.setInput('p-shape', 'bar');
        component.ngOnInit();
        component.ngAfterViewInit();

        expect((component as any).resizeObserver).toBeUndefined();
      });

      it('should not create ResizeObserver when observeTarget is null', () => {
        const parent = document.createElement('div');
        parent.appendChild(nativeElement);
        document.body.appendChild(parent);

        fixture.componentRef.setInput('p-shape', 'circle');
        component.ngOnInit();
        component.ngAfterViewInit();

        expect((component as any).resizeObserver).toBeUndefined();

        document.body.removeChild(parent);
      });

      it('should create ResizeObserver when observeTarget exists', () => {
        const ancestor = document.createElement('div');
        ancestor.style.height = '200px';
        ancestor.style.width = '200px';
        ancestor.appendChild(nativeElement);
        document.body.appendChild(ancestor);

        fixture.componentRef.setInput('p-shape', 'circle');
        component.ngOnInit();
        component.ngAfterViewInit();

        expect((component as any).resizeObserver).toBeDefined();

        document.body.removeChild(ancestor);
      });

      it('should update parentSize when ResizeObserver callback fires with valid dimensions', async () => {
        let resizeCallback: ResizeObserverCallback;
        const OriginalResizeObserver = window.ResizeObserver;

        (window as any).ResizeObserver = class {
          constructor(cb: ResizeObserverCallback) {
            resizeCallback = cb;
          }
          observe() {}
          unobserve() {}
          disconnect() {}
        };

        const ancestor = document.createElement('div');
        ancestor.style.height = '200px';
        ancestor.style.width = '200px';
        ancestor.appendChild(nativeElement);
        document.body.appendChild(ancestor);

        fixture.componentRef.setInput('p-shape', 'circle');
        component.ngOnInit();
        component.ngAfterViewInit();

        resizeCallback([{ contentRect: { width: 200, height: 200 } } as any], {} as any);
        expect(component.parentSize()).toBe(200);
        document.body.removeChild(ancestor);
        window.ResizeObserver = OriginalResizeObserver;
      });
    });
  });
});
