import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiCodeAssistantComponent } from './ai-code-assistant.component';

describe('AiCodeAssistantComponent', () => {
  let component: AiCodeAssistantComponent;
  let fixture: ComponentFixture<AiCodeAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiCodeAssistantComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AiCodeAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title defined', () => {
    expect(component.title).toBe('PO UI AI Code Assistant');
  });
});
