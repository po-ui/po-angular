import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoContainerComponent } from '../po-container';
import { PoWidgetComponent } from './po-widget.component';

describe('PoWidgetComponent with only body', () => {
  let component: PoWidgetComponent;
  let fixture: ComponentFixture<PoWidgetComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoWidgetComponent, PoContainerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoWidgetComponent);
    component = fixture.componentInstance;
    component.height = 200;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not be loaded with title bar', () => {
    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('.po-widget-header') === null).toBe(true);
  });

  it('should not be loaded with action bar', () => {
    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('.po-widget-footer') === null).toBe(true);
  });

  it('should set noShadow to false', () => {
    const nativeElement = fixture.nativeElement;
    component.noShadow = false;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-widget-no-shadow')).toBeFalsy();
  });

  it('should set noShadow to true', () => {
    const nativeElement = fixture.nativeElement;
    component.noShadow = true;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-widget-no-shadow')).toBeTruthy();
  });
});

describe('PoWidgetComponent with title and actions', () => {
  let component: PoWidgetComponent;
  let fixture: ComponentFixture<PoWidgetComponent>;
  let nativeElement;
  const page = 'http://www.fakeUrlPo.com.br';

  // Evento compatível com todos os navegadores, inclusive com o IE
  const eventClick = document.createEvent('MouseEvent');
  eventClick.initEvent('click', false, true);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoWidgetComponent, PoContainerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoWidgetComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    component.title = 'title';

    component.help = page;
    component.primaryLabel = 'Primary';
    component.secondaryLabel = 'secondary';
    component.height = 200;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should simulate widget click.', () => {
    spyOn(component.click, 'emit');

    component.onClick(eventClick);

    expect(component.click.emit).toHaveBeenCalled();
  });

  describe('Properties:', () => {
    it('showTitleAction: should return false if titleAction.observers[0] is undefined', () => {
      component.titleAction.observers[0] = undefined;

      expect(component.showTitleAction).toBeFalsy();
    });

    it('showTitleAction: should return true if titleAction.observers[0] is defined', () => {
      component.titleAction.observers[0] = new Subject();

      expect(component.showTitleAction).toBeTruthy();
    });
  });

  describe('Methods:', () => {
    it('runTitleAction: should call event.stopPropagation and titleAction.emit', () => {
      spyOn(eventClick, 'stopPropagation');
      spyOn(component.titleAction, 'emit');

      component.runTitleAction(eventClick);

      expect(eventClick.stopPropagation).toHaveBeenCalled();
      expect(component.titleAction.emit).toHaveBeenCalled();
    });

    it('runTitleAction: shouldn`t call event.stopPropagation and titleAction.emit if disabled is true', () => {
      component.disabled = true;

      spyOn(eventClick, 'stopPropagation');
      spyOn(component.titleAction, 'emit');

      component.runTitleAction(eventClick);

      expect(eventClick.stopPropagation).not.toHaveBeenCalled();
      expect(component.titleAction.emit).not.toHaveBeenCalled();
    });

    it('onClick: should call click.emit if disabled is false', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = false;

      const spyClickEmit = spyOn(component.click, 'emit');

      component.onClick(mouseEvent);

      expect(spyClickEmit).toHaveBeenCalled();
    });

    it('onClick: shouldn`t call click.emit if disabled is true', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = true;

      const spyClickEmit = spyOn(component.click, 'emit');

      component.onClick(mouseEvent);

      expect(spyClickEmit).not.toHaveBeenCalled();
    });

    it('openHelp: shouldn`t call event.stopPropagation and window.open if disabled is true', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = true;

      spyOn(mouseEvent, 'stopPropagation');
      spyOn(window, 'open');

      component.openHelp(mouseEvent);

      expect(window.open).not.toHaveBeenCalled();
      expect(mouseEvent.stopPropagation).not.toHaveBeenCalled();
    });

    it('openHelp: should call event.stopPropagation and window.open if disabled is false', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = false;

      const spyStopPropagation = spyOn(mouseEvent, 'stopPropagation');
      const spyWindowOpen = spyOn(window, 'open');

      component.openHelp(mouseEvent);

      expect(spyWindowOpen).toHaveBeenCalled();
      expect(spyStopPropagation).toHaveBeenCalled();
    });

    it('runPrimaryAction: shouldn`t call event.stopPropagation and primaryAction.emit if disabled is true', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = true;

      const spyStopPropagation = spyOn(mouseEvent, 'stopPropagation');
      const spyPrimaryActionEmit = spyOn(component.primaryAction, 'emit');

      component.runPrimaryAction(mouseEvent);

      expect(spyPrimaryActionEmit).not.toHaveBeenCalled();
      expect(spyStopPropagation).not.toHaveBeenCalled();
    });

    it('runPrimaryAction: should call event.stopPropagation and primaryAction.emit if disabled is false', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = false;

      const spyStopPropagation = spyOn(mouseEvent, 'stopPropagation');
      const spyPrimaryActionEmit = spyOn(component.primaryAction, 'emit');

      component.runPrimaryAction(mouseEvent);

      expect(spyPrimaryActionEmit).toHaveBeenCalled();
      expect(spyStopPropagation).toHaveBeenCalled();
    });

    it('runSecondaryAction: shouldn`t call event.stopPropagation and secondaryAction.emit if disabled is true', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = true;

      spyOn(mouseEvent, 'stopPropagation');
      spyOn(component.secondaryAction, 'emit');

      component.runSecondaryAction(mouseEvent);

      expect(component.secondaryAction.emit).not.toHaveBeenCalled();
      expect(mouseEvent.stopPropagation).not.toHaveBeenCalled();
    });

    it('runSecondaryAction: should call event.stopPropagation and secondaryAction.emit if disabled is false', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = false;

      const spyStopPropagation = spyOn(mouseEvent, 'stopPropagation');
      const spySecondaryActionEmit = spyOn(component.secondaryAction, 'emit');

      component.runSecondaryAction(mouseEvent);

      expect(spySecondaryActionEmit).toHaveBeenCalled();
      expect(spyStopPropagation).toHaveBeenCalled();
    });

    it('settingOutput: shouldn`t call event.stopPropagation and setting.emit if disabled is true', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = true;

      const spyStopPropagation = spyOn(mouseEvent, 'stopPropagation');
      const spySettingEmit = spyOn(component.setting, 'emit');

      component.settingOutput(mouseEvent);

      expect(spySettingEmit).not.toHaveBeenCalled();
      expect(spyStopPropagation).not.toHaveBeenCalled();
    });

    it('settingOutput: should call event.stopPropagation and setting.emit if disabled is false', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click');

      component.disabled = false;

      spyOn(mouseEvent, 'stopPropagation');
      spyOn(component.setting, 'emit');

      component.settingOutput(mouseEvent);

      expect(component.setting.emit).toHaveBeenCalled();
      expect(mouseEvent.stopPropagation).toHaveBeenCalled();
    });

    it('hasTitleHelpOrSetting: should return true if have title', () => {
      component.title = 'widgetTitle';
      component.help = undefined;
      component.setting.observers = [];

      expect(component.hasTitleHelpOrSetting()).toBe(true);
    });

    it('hasTitleHelpOrSetting: should return true if have help', () => {
      component.title = undefined;
      component.help = 'widgetHelp';
      component.setting.observers = [];

      expect(component.hasTitleHelpOrSetting()).toBe(true);
    });

    it('hasTitleHelpOrSetting: should return true if have setting', () => {
      component.title = undefined;
      component.help = undefined;
      component.setting.observers = [new Subject()];

      expect(component.hasTitleHelpOrSetting()).toBe(true);
    });

    it('setHeight: should set `containerHeight` with calculate value if have `height` and `setting` and doesn`t have `title`', () => {
      const result = '163px';
      component.title = undefined;
      component.primaryLabel = undefined;
      component.help = undefined;
      component.setting.observers = [new Subject()];

      component.setHeight(component.height);

      expect(component.containerHeight).toBe(result);
    });

    it('setHeight: should set `containerHeight` with calculate value if have `height` and `help` and doesn`t have `title`', () => {
      const result = '163px';
      component.title = undefined;
      component.primaryLabel = undefined;
      component.setting.observers = [];

      component.setHeight(component.height);

      expect(component.containerHeight).toBe(result);
    });

    it(`setHeight: should set 'containerHeight' with calculate value if have 'noShadow', 'height' and 'help' and
    doesn't have 'title'`, () => {
      const result = '161px';
      component.noShadow = true;
      component.title = undefined;
      component.primaryLabel = undefined;
      component.setting.observers = [];

      component.setHeight(component.height);

      expect(component.containerHeight).toBe(result);
    });

    it('setHeight: should set `containerHeight` with calculate value if have `height` and doesn`t have `title`', () => {
      const result = '200px';
      component.title = undefined;
      component.primaryLabel = undefined;
      component.help = undefined;
      component.setting.observers = [];

      component.setHeight(component.height);

      expect(component.containerHeight).toBe(result);
    });

    it('hasTitleHelpOrSetting: should return false if doesn`t have help, title and setting', () => {
      component.title = undefined;
      component.help = undefined;
      component.setting.observers = [];

      expect(component.hasTitleHelpOrSetting()).toBe(false);
    });
  });

  describe('Templates:', () => {
    it('should have po-widget-header if have title', () => {
      component.title = 'widgetTitle';
      component.help = undefined;
      component.setting.observers = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-widget-header')).toBeTruthy();
    });

    it('should have po-widget-header if have help', () => {
      component.title = undefined;
      component.help = 'widgetHelp';
      component.setting.observers = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-widget-header')).toBeTruthy();
    });

    it('should have po-widget-header if have setting', () => {
      component.title = undefined;
      component.help = undefined;
      component.setting.observers = [new Subject()];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-widget-header')).toBeTruthy();
    });

    it('shouldn`t have po-widget-header if doesn`t have help, title and setting', () => {
      component.title = undefined;
      component.help = undefined;
      component.setting.observers = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-widget-header')).toBeFalsy();
    });

    it('should be called the click event when clicked on the `po-widget` area.', () => {
      const test = nativeElement.querySelector('.po-widget');

      spyOn(component.click, 'emit');

      test.dispatchEvent(eventClick);
      fixture.detectChanges();

      expect(component.click.emit).toHaveBeenCalled();
    });

    it('should be loaded with title bar', () => {
      expect(nativeElement.querySelector('.po-widget-header') !== null).toBe(true);
    });

    it('should be loaded with action bar', () => {
      expect(nativeElement.querySelector('.po-widget-footer') !== null).toBe(true);
    });

    it('should have been clicked in primary action', () => {
      spyOn(component.primaryAction, 'emit');

      fixture.detectChanges();

      const link = nativeElement.querySelector('#primaryAct');

      spyOn(eventClick, 'stopPropagation');

      link.dispatchEvent(eventClick);

      expect(component.primaryAction.emit).toHaveBeenCalledWith();
      expect(eventClick.stopPropagation).toHaveBeenCalled();
    });

    it('should have been clicked in secondary action', () => {
      spyOn(component.secondaryAction, 'emit');
      spyOn(eventClick, 'stopPropagation');

      const link = nativeElement.querySelector('#secondaryAct');

      link.dispatchEvent(eventClick);

      expect(component.secondaryAction.emit).toHaveBeenCalled();
      expect(eventClick.stopPropagation).toHaveBeenCalled();
    });

    it('should have been clicked in setting', () => {
      spyOn(component.setting, 'emit');
      component.setting.subscribe();

      fixture.detectChanges();

      const test = nativeElement.querySelector('#settingAction');

      spyOn(eventClick, 'stopPropagation');

      test.dispatchEvent(eventClick);

      expect(component.setting.emit).toHaveBeenCalled();
      expect(eventClick.stopPropagation).toHaveBeenCalled();
    });

    it('should be created the help button', () => {
      expect(nativeElement.querySelector('#helpLink') !== null).toBe(true);
    });

    it('should have been clicked in help', () => {
      const help = nativeElement.querySelector('#helpLink');

      spyOn(eventClick, 'stopPropagation');
      spyOn(window, 'open');

      help.dispatchEvent(eventClick);

      expect(window.open).toHaveBeenCalledWith(page, '_blank');
      expect(eventClick.stopPropagation).toHaveBeenCalled();
    });

    it('should have, in the main `div`, the` po-clickable` class, when it does not have (p-click) action.', () => {
      component.click.observers.length = 1;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-widget.po-clickable')).toBeTruthy();
    });

    it('should not have `po-clickable` class in the `div` when it does not have (p-click) action.', () => {
      expect(nativeElement.querySelector('.po-widget.po-clickable')).toBeFalsy();
    });

    it('should remove class `po-widget` and add `po-widget-primary` if property `primary` is true', () => {
      component.primary = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-widget-primary')).toBeTruthy();
      expect(nativeElement.querySelector('.po-widget')).toBeFalsy();
    });

    it('shouldn`t add class `po-widget` if property primary is not true', () => {
      component.primary = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-widget-primary')).toBeFalsy();
      expect(nativeElement.querySelector('.po-widget')).toBeTruthy();
    });

    it('should call runTitleAction if po-widget-title-action is clicked', () => {
      component.titleAction.observers[0] = new Subject();

      fixture.detectChanges();

      const titleWithAction = nativeElement.querySelector('.po-widget-title-action');

      const mouseEvent = document.createEvent('MouseEvents');
      mouseEvent.initEvent('click', false, true);

      spyOn(component, 'runTitleAction');

      titleWithAction.dispatchEvent(mouseEvent);

      expect(component.runTitleAction).toHaveBeenCalled();
    });

    it('should not create title with .po-widget-title-action if the title has no action', () => {
      component.titleAction.observers[0] = undefined;

      fixture.detectChanges();

      const titleWithAction = nativeElement.querySelector('.po-widget-title-action');

      expect(titleWithAction).toBeFalsy();
    });

    it('should create footer with `.po-widget-footer` if have `primaryLabel`', () => {
      component.primaryLabel = 'primary';

      fixture.detectChanges();

      const footer = nativeElement.querySelector('.po-widget-footer');

      expect(footer).toBeTruthy();
    });

    it('shouldn`t create footer with `.po-widget-footer` if doesn`t have `primaryLabel`', () => {
      component.primaryLabel = undefined;

      fixture.detectChanges();

      const footer = nativeElement.querySelector('.po-widget-footer');

      expect(footer).toBeFalsy();
    });

    it(`should have '.po-widget-xl' and one '.po-widget-action' and doesn't have '.po-widget-md' if have 'primaryLabel'
    and doesn't have 'secondaryLabel'`, () => {
      component.primaryLabel = 'primary';
      component.secondaryLabel = undefined;

      fixture.detectChanges();

      const widgetActioncontainerXl = nativeElement.querySelector('.po-widget-xl');
      const widgetActionContainerMd = nativeElement.querySelector('.po-widget-md');
      const action = nativeElement.querySelectorAll('.po-widget-action');

      expect(widgetActioncontainerXl).toBeTruthy();
      expect(widgetActionContainerMd).toBeFalsy();
      expect(action.length).toBe(1);
    });

    it(`should have two '.po-widget-md' and two '.po-widget-action' and doesn't have '.po-widget-xl' if have
    'primaryLabel' and 'secondaryLabel'`, () => {
      component.primaryLabel = 'primary';
      component.secondaryLabel = 'secondary';

      fixture.detectChanges();

      const widgetActioncontainerXl = nativeElement.querySelector('.po-widget-xl');
      const widgetaActionContainerMd = nativeElement.querySelectorAll('.po-widget-md');
      const action = nativeElement.querySelectorAll('.po-widget-action');

      expect(widgetActioncontainerXl).toBeFalsy();
      expect(widgetaActionContainerMd.length).toBe(2);
      expect(action.length).toBe(2);
    });

    it('should find .po-widget-disabled if disabled is true', () => {
      component.disabled = true;

      fixture.detectChanges();

      const widgetDisabled = nativeElement.querySelector('.po-widget-disabled');

      expect(widgetDisabled).toBeTruthy();
    });

    it('shouldn`t find .po-widget-disabled if disabled is false', () => {
      component.disabled = false;

      fixture.detectChanges();

      const widgetDisabled = nativeElement.querySelector('.po-widget-disabled');

      expect(widgetDisabled).toBe(null);
    });
  });
});

describe('PoWidgetComponent with actions', () => {
  let component: PoWidgetComponent;
  let fixture: ComponentFixture<PoWidgetComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoWidgetComponent, PoContainerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoWidgetComponent);
    component = fixture.componentInstance;
    component.primaryAction = null;
    component.primaryLabel = 'Primary';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be loaded with action bar', () => {
    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('.po-widget-footer') !== null).toBe(true);
  });
});

describe('PoWidgetComponent with background and actions', () => {
  let component: PoWidgetComponent;
  let fixture: ComponentFixture<PoWidgetComponent>;

  const image: string = 'http://lorempixel.com/400/400/';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoWidgetComponent, PoContainerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoWidgetComponent);
    component = fixture.componentInstance;
    component.primaryAction = null;
    component.primaryLabel = 'Primary';
    component.height = 200;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be loaded with action bar', () => {
    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('.po-widget-footer') !== null).toBe(true);
  });

  it('should be loaded with no background', () => {
    expect(fixture.nativeElement.querySelector('.po-widget').style.backgroundImage).toEqual('');
  });

  it('should be loaded with background', () => {
    component.background = image;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.po-widget').style.backgroundImage).toEqual(`url("${image}")`);
  });
});
