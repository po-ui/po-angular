import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSampleHostDirective } from './preview-sample-host.directive';

@Component({
  template: `<div [appPreviewSampleHost]="name" [appPreviewSampleDetach]="detach"></div>`,
  imports: [PreviewSampleHostDirective]
})
class HostComponent {
  name = 'po-tag';
  detach = false;
}

describe('PreviewSampleHostDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  // the ViewRef prototype is shared by the host view and by the views created with createComponent
  const viewRefPrototype = () => Object.getPrototypeOf(fixture.componentRef.changeDetectorRef);

  const waitForSample = async () => {
    await fixture.whenStable();
    // the dynamic import() resolves after a few macrotasks
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
  });

  it('should render the sample of the given name', async () => {
    fixture.detectChanges();
    await waitForSample();
    expect(fixture.nativeElement.querySelector('app-preview-po-tag')).not.toBeNull();
  });

  it('should not detach the sample by default', async () => {
    const detach = spyOn(viewRefPrototype(), 'detach').and.callThrough();
    fixture.detectChanges();
    await waitForSample();
    expect(detach).not.toHaveBeenCalled();
  });

  it('should render nothing for an unknown sample', async () => {
    fixture.componentInstance.name = 'unknown';
    fixture.detectChanges();
    await waitForSample();
    expect(fixture.nativeElement.querySelector('[class*="po-"]')).toBeNull();
  });

  it('should detach the sample after the first render when appPreviewSampleDetach is on', async () => {
    const detach = spyOn(viewRefPrototype(), 'detach').and.callThrough();
    fixture.componentInstance.detach = true;
    fixture.detectChanges();
    await waitForSample();
    // rendered first (the tag is in the DOM), then detached
    expect(fixture.nativeElement.querySelector('app-preview-po-tag po-tag')).not.toBeNull();
    expect(detach).toHaveBeenCalledTimes(1);
  });
});
