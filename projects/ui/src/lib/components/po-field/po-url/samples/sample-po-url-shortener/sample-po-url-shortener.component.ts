import { Component, ElementRef, ViewChild } from '@angular/core';

import { PoNotificationService, PoTableColumn } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-url-shortener',
  templateUrl: './sample-po-url-shortener.component.html'
})
export class SamplePoUrlShortenerComponent {
  baseUrls: Array<any> = [];
  shortenedUrl: string;
  url: string;

  public readonly urlColumns: Array<PoTableColumn> = [
    { property: 'url', label: 'Long URL' },
    { property: 'short', label: 'Shortened URL' }
  ];

  @ViewChild('boxUrl', { read: ElementRef, static: true }) boxUrlElement;

  constructor(private poNotification: PoNotificationService) {}

  copyToClipboard() {
    this.boxUrlElement.nativeElement.querySelector('input').select();
    document.execCommand('copy');
    this.poNotification.success('Text copied!');
  }

  shortenUrl() {
    const urlBase64 = btoa(this.url.replace(/http|www|com|br|\/|\./gi, '').trim());

    this.shortenedUrl = `po.com/${urlBase64.substr(urlBase64.length - 3)}` + this.baseUrls.length;
    this.baseUrls.push({ url: this.url, short: this.shortenedUrl });
  }
}
