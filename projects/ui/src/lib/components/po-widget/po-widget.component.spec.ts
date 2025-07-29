import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { SimpleChange, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { PoContainerComponent } from '../po-container';
import { PoWidgetComponent } from './po-widget.component';

describe('PoWidgetComponent with only body', () => {
  let component: PoWidgetComponent;
  let fixture: ComponentFixture<PoWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoWidgetComponent, PoContainerComponent]
    }).compileComponents();

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

  it('should`t set noShadow to true if the widget is not clickable', () => {
    const nativeElement = fixture.nativeElement;
    component.noShadow = true;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-widget-no-shadow')).toBeFalsy();
  });

  it('should set noShadow in template if the widget is clickable and noShadow is true', () => {
    component.click.subscribe(() => {});
    component.noShadow = true;
    const nativeElement = fixture.nativeElement;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-widget-no-shadow')).toBeTruthy();
  });

  it('should`t set noShadow in template if the widget is clickable and noShadow is false', () => {
    component.click.subscribe(() => {});
    component.noShadow = false;
    const nativeElement = fixture.nativeElement;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-widget-no-shadow')).toBeFalsy();
  });
});

describe('PoWidgetComponent with title and actions', () => {
  let component: PoWidgetComponent;
  let fixture: ComponentFixture<PoWidgetComponent>;
  let nativeElement;
  const page = 'http://www.fakeUrlPo.com.br';
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  // Evento compatível com todos os navegadores, inclusive com o IE
  const eventClick = document.createEvent('MouseEvent');
  eventClick.initEvent('click', false, true);

  beforeEach(async () => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    await TestBed.configureTestingModule({
      declarations: [PoWidgetComponent, PoContainerComponent],
      providers: [{ provide: PoThemeService, useValue: poThemeServiceMock }]
    }).compileComponents();

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

  it('should be call checkDefaultActions if help changes', () => {
    spyOn(component, <any>'checkDefaultActions');

    const changes: SimpleChanges = {
      help: new SimpleChange(true, false, true)
    };

    component.ngOnChanges(changes);

    expect(component['checkDefaultActions']).toHaveBeenCalled();
  });

  it('should be call checkDefaultActions if actions changes', () => {
    spyOn(component, <any>'checkDefaultActions');
    component.tagLabel = 'test';
    const changes: SimpleChanges = {
      actions: new SimpleChange([], [{ label: 'action' }], true)
    };

    component.ngOnChanges(changes);

    expect(component['checkDefaultActions']).toHaveBeenCalled();
  });

  it('should call detectChanges', () => {
    spyOn(component['cd'], <any>'detectChanges');
    component.tagLabel = 'test';
    const changes: SimpleChanges = {
      tagLabel: new SimpleChange('test', 'test1', true)
    };

    component.ngOnChanges(changes);

    expect(component['cd'].detectChanges).toHaveBeenCalled();
  });

  it('should be call toggle of poPopupComponent', () => {
    spyOn(component, 'togglePopup');
    component.actions = [{ label: 'teste', action: () => {} }];

    const div = fixture.debugElement.query(By.css('.po-widget-button-wrapper'));

    div.triggerEventHandler('click', null);

    expect(component.togglePopup).toHaveBeenCalled();
  });

  it('should set popupTarget', () => {
    const div = fixture.debugElement.query(By.css('.po-widget-button-wrapper'));
    component.poPopupComponent = { toggle: () => {} } as any;
    component.togglePopup(div, { stopPropagation: () => {} });

    expect(component.popupTarget).toEqual(div);
  });

  it('should simulate widget click.', () => {
    component.click.subscribe(() => {});
    spyOn(component.click, 'emit');

    component.onClick(eventClick);

    expect(component.click.emit).toHaveBeenCalled();
  });

  it('should`t emit click if widget is not clickable', () => {
    component.click.unsubscribe();
    spyOn(component.click, 'emit');

    component.onClick(eventClick);

    expect(component.click.emit).not.toHaveBeenCalled();
  });

  it('should simulate widget selected with keyboard (key which mode)', () => {
    component.click.subscribe(() => {});
    const fakeEvent: any = {
      which: 32,
      preventDefault: () => {}
    };
    spyOn(component.click, 'emit');

    component.onKeyDown(fakeEvent);

    expect(component.click.emit).toHaveBeenCalled();
  });

  it('should simulate widget selected with keyboard (key code mode)', () => {
    component.click.subscribe(() => {});
    const fakeEvent: any = {
      keyCode: 32,
      preventDefault: () => {}
    };
    spyOn(component.click, 'emit');

    component.onKeyDown(fakeEvent);

    expect(component.click.emit).toHaveBeenCalled();
  });

  it('should`t emit click with keyboard if widget is not clickable', () => {
    component.click.unsubscribe();
    const fakeEvent: any = {
      keyCode: 32,
      preventDefault: () => {}
    };

    spyOn(component.click, 'emit');

    component.onKeyDown(fakeEvent);

    expect(component.click.emit).not.toHaveBeenCalled();
  });

  it('updateContent should set hasContent to true if child is type text', () => {
    const fakeThis = {
      contentContainer: {
        nativeElement: {
          childNodes: [{ nodeType: 3, textContent: 'test' }]
        }
      },
      hasContent: false,
      cd: { detectChanges: () => {} }
    };

    component['updateContent'].call(fakeThis);

    expect(fakeThis.hasContent).toBeTruthy();
  });

  it('updateContent should set hasContent to false if textContent is undefined', () => {
    const fakeThis = {
      contentContainer: {
        nativeElement: {
          childNodes: [{ nodeType: 3 }]
        }
      },
      hasContent: false,
      cd: { detectChanges: () => {} }
    };

    component['updateContent'].call(fakeThis);

    expect(fakeThis.hasContent).toBeFalsy();
  });

  it('updateContent should set hasContent to true if child is type element', () => {
    const fakeThis = {
      contentContainer: {
        nativeElement: {
          childNodes: [{ nodeType: 1, textContent: 'test' }]
        }
      },
      hasContent: false,
      cd: { detectChanges: () => {} }
    };

    component['updateContent'].call(fakeThis);

    expect(fakeThis.hasContent).toBeTruthy();
  });

  it('updateContent should set hasContent to false if child is empty', () => {
    const fakeThis = {
      contentContainer: {
        nativeElement: {
          childNodes: [{ nodeType: 0, textContent: '' }]
        }
      },
      hasContent: false,
      cd: { detectChanges: () => {} }
    };

    component['updateContent'].call(fakeThis);

    expect(fakeThis.hasContent).toBeFalsy();
  });

  it('updateContent should return void if element does not exist', () => {
    const fakeThis = {
      cd: { detectChanges: () => {} }
    };

    const expected = component['updateContent'].call(fakeThis);

    expect(expected).toBeFalsy();
  });

  it('should return true if wrapperTitle is larger than wrapperInfo', () => {
    component.tagLabel = 'tag';
    component.title = 'My Title';
    const fakeThis = {
      tagLabel: 'tag',
      title: 'My Title',
      wrapperTitle: {
        nativeElement: {
          offsetWidth: 60
        }
      },
      tagElement: {
        nativeElement: {
          offsetWidth: 40
        }
      },
      wrapperInfo: {
        nativeElement: {
          offsetWidth: 70
        }
      }
    };

    const expected = component.showTooltip.call(fakeThis);

    expect(expected).toBeTruthy();
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
      component.click.subscribe(() => {});
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
      component.disabled = true;

      spyOn(window, 'open');

      component.openHelp();

      expect(window.open).not.toHaveBeenCalled();
    });

    it('openHelp: should call event.stopPropagation and window.open if disabled is false', () => {
      component.disabled = false;

      const spyWindowOpen = spyOn(window, 'open');

      component.openHelp();

      expect(spyWindowOpen).toHaveBeenCalled();
    });

    it('runPrimaryAction: shouldn`t call event.stopPropagation and primaryAction.emit if disabled is true', () => {
      component.disabled = true;

      const spyPrimaryActionEmit = spyOn(component.primaryAction, 'emit');

      component.runPrimaryAction();

      expect(spyPrimaryActionEmit).not.toHaveBeenCalled();
    });

    it('runPrimaryAction: should call event.stopPropagation and primaryAction.emit if disabled is false', () => {
      component.disabled = false;

      const spyPrimaryActionEmit = spyOn(component.primaryAction, 'emit');

      component.runPrimaryAction();

      expect(spyPrimaryActionEmit).toHaveBeenCalled();
    });

    it('runSecondaryAction: shouldn`t call event.stopPropagation and secondaryAction.emit if disabled is true', () => {
      component.disabled = true;

      spyOn(component.secondaryAction, 'emit');

      component.runSecondaryAction();

      expect(component.secondaryAction.emit).not.toHaveBeenCalled();
    });

    it('runSecondaryAction: should call event.stopPropagation and secondaryAction.emit if disabled is false', () => {
      component.disabled = false;

      const spySecondaryActionEmit = spyOn(component.secondaryAction, 'emit');

      component.runSecondaryAction();

      expect(spySecondaryActionEmit).toHaveBeenCalled();
    });

    it('settingOutput: shouldn`t call event.stopPropagation and setting.emit if disabled is true', () => {
      component.disabled = true;

      const spySettingEmit = spyOn(component.setting, 'emit');

      expect(spySettingEmit).not.toHaveBeenCalled();
    });

    it('settingOutput: should call event.stopPropagation and setting.emit if disabled is false', () => {
      component.disabled = false;

      spyOn(component.setting, 'emit');

      component.settingOutput();

      expect(component.setting.emit).toHaveBeenCalled();
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

    it('hasTitleHelpOrSetting: should return false if doesn`t have help, title and setting', () => {
      component.title = undefined;
      component.help = undefined;
      component.setting.observers = [];
      component.actions = [];

      expect(component.hasTitleHelpOrSetting()).toBe(false);
    });

    it('should set containerHeight to "auto" when height is 0 or undefined', () => {
      component.setHeight(0);
      expect(component.containerHeight).toBe('auto');

      component.setHeight(undefined);
      expect(component.containerHeight).toBe('auto');
    });

    it('should calculate containerHeight correctly with title', () => {
      component.title = 'Test';
      component.actions = [];
      component.primaryLabel = undefined;
      component.secondaryLabel = undefined;
      component.setHeight(100);
      expect(component.containerHeight).toBe(`${30}px`);
    });

    it('should calculate containerHeight correctly with tag and icon', () => {
      component.tagLabel = 'Test';
      component.tagIcon = 'an an-pallet-full';
      component.help = undefined;
      component.actions = [];
      component.primaryLabel = undefined;
      component.secondaryLabel = undefined;
      component.setHeight(200);
      expect(component.containerHeight).toBe(`${148}px`);
    });

    it('should calculate containerHeight correctly with title and actions', () => {
      component.title = 'Test';
      component.actions = [{ label: 'Test' }];
      component.primaryLabel = undefined;
      component.secondaryLabel = undefined;
      component.setHeight(100);
      expect(component.containerHeight).toBe(`${30}px`);
    });

    it('should calculate containerHeight correctly with title, actions and prymaryLabel', () => {
      component.title = 'Test';
      component.actions = [{ label: 'Test' }];
      component.primaryLabel = 'test1';
      component.secondaryLabel = 'test2';
      component.setHeight(200);
      expect(component.containerHeight).toBe(`${62}px`);
    });

    it('should calculate containerHeight correctly with title, AA, actions and prymaryLabel', () => {
      poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
      poThemeServiceMock.getA11yDefaultSize.and.returnValue('small');

      component.title = 'Test';
      component.actions = [{ label: 'Test' }];
      component.primaryLabel = 'test1';
      component.secondaryLabel = 'test2';
      component.setHeight(200);
      expect(component.containerHeight).toBe(`${86}px`);
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
      component.actions = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-widget-header')).toBeFalsy();
    });

    it('should be called the click event when clicked on the `po-widget` area.', () => {
      component.click.subscribe(() => {});
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

    it('should be created the help button', () => {
      component.id = '1';
      expect(nativeElement.querySelector('helpLink-1') !== null).toBe(false);
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoWidgetComponent, PoContainerComponent]
    }).compileComponents();

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

  it('should add configuration action if configuration is available and there is no action with $id "widget_configuration"', () => {
    Object.defineProperty(component.setting, 'observed', {
      get: () => true
    });

    component.actions = [];

    component['checkDefaultActions']();

    const configAction = component.actions.find(a => a.$id === 'widget_configuration');
    expect(configAction).toBeTruthy();
    expect(configAction?.icon).toBe('ICON_SETTINGS');
  });

  it('should not add action if "observed" is false', () => {
    spyOn(component, 'settingOutput').and.callFake(() => {});

    Object.defineProperty(component.setting, 'observed', {
      get: () => false
    });

    component['checkDefaultActions']();

    expect(component.actions.length).toBe(0);
  });

  it('should not add action if "widget_configuration" already exists', () => {
    component.actions = [{ $id: 'widget_configuration', icon: '', label: '', type: '', action: () => {} }];

    component['checkDefaultActions']();

    expect(component.actions.length).toBe(1);
  });

  it('should not add configuration action if configuration is already in actions', () => {
    Object.defineProperty(component.setting, 'observed', {
      get: () => true
    });

    component.actions = [{ label: 'test', $id: 'widget_configuration' }];
    component.help = undefined;
    component['checkDefaultActions']();

    const configAction = component.actions.find(a => a.$id === 'widget_configuration');
    expect(configAction).toBeTruthy();
    expect(component.actions.length).toBe(1);
  });

  it('should not add configuration action if setting is not observed', () => {
    Object.defineProperty(component.setting, 'observed', {
      get: () => false
    });

    component.actions = [];

    component['checkDefaultActions']();

    const configAction = component.actions.find(a => a.$id === 'widget_configuration');
    expect(configAction).toBeUndefined();
  });

  it('should add help action if help is true and there is no action with $id "widget_help"', () => {
    component.help = 'myurl';
    component.actions = [];

    component['checkDefaultActions']();

    const helpAction = component.actions.find(a => a.$id === 'widget_help');
    expect(helpAction).toBeTruthy();
    expect(helpAction?.icon).toBe('ICON_HELP');
  });

  it('should remove help action if help is false', () => {
    component.actions = [
      { $id: 'widget_help', label: 'Help', icon: 'ICON_HELP', type: 'default', action: () => {} },
      { $id: 'another_action', label: 'Other', icon: 'ICON_OTHER', type: 'default', action: () => {} }
    ];
    component.help = undefined;

    component['checkDefaultActions']();

    expect(component.actions.some(a => a.$id === 'widget_help')).toBeFalse();
    expect(component.actions.some(a => a.$id === 'another_action')).toBeTrue();
  });

  it('should not add help if help already exists in actions', () => {
    component.actions = [
      { $id: 'widget_help', label: 'Help', icon: 'ICON_HELP', type: 'default', action: () => {} },
      { $id: 'another_action', label: 'Other', icon: 'ICON_OTHER', type: 'default', action: () => {} }
    ];

    component.help = 'myurl';

    component['checkDefaultActions']();

    expect(component.actions.length).toBe(2);
  });

  it('shoukd focus on po-button when action is closed', () => {
    const mockButton = jasmine.createSpyObj('PoButtonComponent', ['focus']);
    component.buttonPopUp = mockButton;

    component.closePopUp();

    expect(mockButton.focus).toHaveBeenCalled();
  });
});

describe('PoWidgetComponent with background and actions', () => {
  let component: PoWidgetComponent;
  let fixture: ComponentFixture<PoWidgetComponent>;

  const image: string = 'http://lorempixel.com/400/400/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoWidgetComponent, PoContainerComponent]
    }).compileComponents();

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
